import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext
} from "react";

const TelemetryContext = createContext(null);
export const useTelemetry = () => useContext(TelemetryContext);

export const TelemetryProvider = ({ children, src = "https://smartdatanodeservernew.vercel.app/api/getChartJson" }) => {
  const [raw, setRaw] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const secondsIndexRef = useRef(null);

const [visibleLabels, setVisibleLabels] = useState([])
const [availableCharts, setavailableCharts] = useState([])

  const [currentSecond, setCurrentSecond] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRafRef = useRef(null);

  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  const [totalLabels, settotalLabels] = useState(0)


  // 🟩 Default sets for each label if JSON doesn’t already contain them
  const defaultChartTypes = ["digital", "analog"];
  const defaultLabelColors = [
    "#FF5733", "#33FF66", "#335BFF", "#FFC133", "#FF33A8", "#33FFF9"
  ];
  const defaultChartColors = [
    "#33C1FF", "#FFC133", "#9D33FF", "#33FF77", "#FF3333", "#3385FF"
  ];

  // 🟦 Load and normalize data
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(src);
        const json = await res.json();
        if (cancelled) return;

        // Normalize labels with chart + color info
        const arr = (json.data || []).map((entry, index) => {
          const enrichedLabels = (entry.labels || entry.label || []).map((lbl, i) => ({
            ...lbl,
            title: lbl.title || `Label ${i + 1}`,
            chartTypes: lbl.chartTypes || defaultChartTypes,
            labelColors: lbl.labelColors || [defaultLabelColors[i % defaultLabelColors.length]],
            chartColors: lbl.chartColors || [defaultChartColors[i % defaultChartColors.length]]
          }));

          return { ...entry, labels: enrichedLabels };
        });

        setRaw(json);
        // console.log("overall arr",json)
        setDataArray(arr);
        settotalLabels(json.labelCount)

        // Build O(1) lookup
        const maxSecond = arr.length ? Math.max(...arr.map((d) => d.second)) : -1;
        const idx = new Array(maxSecond + 1).fill(null);
        for (const entry of arr) {
          if (entry && typeof entry.second === "number") idx[entry.second] = entry;
        }
        secondsIndexRef.current = idx;

        if (arr.length) setCurrentSecond(arr[0].second || 0);



      } catch (err) {
        console.error("Telemetry load error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src]);

  // 🟨 Start/End seconds and time strings
  const { startSecond, endSecond, startTimeString, endTimeString } = useMemo(() => {
    if (!dataArray.length)
      return { startSecond: 0, endSecond: 0, startTimeString: null, endTimeString: null };

    const first = dataArray[0];
    const last = dataArray[dataArray.length - 1];

    
    return {
      startSecond: first.second ?? 0,
      endSecond: last.second ?? (dataArray.length - 1),
      startTimeString: first.timestamp ?? null,
      endTimeString: last.timestamp ?? null
    };
  }, [dataArray]);

  // 🟩 Getters
  const getBySecond = useCallback((sec) => {
    const idx = secondsIndexRef.current;
    if (!idx || sec == null) return null;
    return idx[sec] || null;
  }, []);

  const getByTimeString = useCallback(
    (timeString) => {
      if (!raw || !raw.data) return null;
      if (!timeString) return null;

      if (raw.data[0]?.timestamp) {
        const hhmm = timeString.slice(0, 5);
        const found = raw.data.find((d) => d.timestamp?.includes(hhmm));
        if (found) return found;
      }

      const parts = timeString.split(":").map(Number);
      if (parts.length === 3) {
        const sec = parts[0] * 3600 + parts[1] * 60 + parts[2];
        return getBySecond(sec);
      } else if (parts.length === 2) {
        const sec = parts[0] * 60 + parts[1];
        return getBySecond(sec);
      }
      return null;
    },
    [raw, getBySecond]
  );

  // 🟩 Derived labels for current second
  const currentLabels = useMemo(() => {
    const entry = getBySecond(currentSecond);
    return (entry && entry.labels) ? entry.labels : [];
  }, [currentSecond, getBySecond]);


  useEffect(() => {
  if (dataArray.length) {
    const first = dataArray[0];
    const last = dataArray[dataArray.length - 1];

    setTrimStart(first.second ?? 0);
    setTrimEnd(last.second ?? 0);
    setCurrentSecond(first.second ?? 0);
  }
}, [dataArray]);



  // 🟦 Playback logic
  useEffect(() => {
    if (!isPlaying) {
      if (playRafRef.current) {
        cancelAnimationFrame(playRafRef.current);
        playRafRef.current = null;
      }
      return;
    }

    let lastTime = performance.now();
    const tick = (now) => {
      const delta = now - lastTime;
      if (delta >= 1000) {
        lastTime = now;
        setCurrentSecond((prev) => {
          const next = (prev === null ? startSecond : prev) + 1;
          return next > endSecond ? endSecond : next;
        });
      }
      playRafRef.current = requestAnimationFrame(tick);
    };
    playRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (playRafRef.current) {
        cancelAnimationFrame(playRafRef.current);
        playRafRef.current = null;
      }
    };
  }, [isPlaying, startSecond, endSecond]);






const visibleChartData = useMemo(() => {
  if (!dataArray.length || !visibleLabels.length) return [];

  // Step 1: filter seconds
  // const filtered = dataArray.filter(
  //   (entry) => entry.second >= trimStart && entry.second <= trimEnd
  // );

  // Step 2: build data for each visible label
  return visibleLabels.map((labelName) => {

    const points = dataArray.map((entry) => {
      const lbl = entry.labels.find((l) => l.title === labelName);
      // console.log("lbl lbl",lbl)
      return {
        second: entry.second,
        timestamp: entry.timestamp,
        avgValue: lbl.avgValue,
        maxValue:lbl.maxValue,
        minValue:lbl.minValue,
        chartColor:lbl.chartColor,
        chartType:lbl.chartType,
        digitalStatus:lbl.digitalStatus,
        time:lbl.time
      };
    });
    return { label: labelName, data: points, chartType: points[0]?.chartType ?? 'analog' };
  });
}, [dataArray, visibleLabels, trimStart, trimEnd]);





  // 🟩 Value exposed to all components
  const value = useMemo(
    () => ({
      raw,
      dataArray,
      getBySecond,
      getByTimeString,
      currentSecond,
      setCurrentSecond,
      currentLabels, // includes chart types + colors + title
      isPlaying,
      setIsPlaying,
      startSecond,
      endSecond,
      startTimeString,
      endTimeString,
      visibleLabels,
      setVisibleLabels,
      trimStart,
      trimEnd,
      setTrimStart,
      setTrimEnd,
      totalLabels,
      settotalLabels,
      visibleChartData
    }),
    [
      raw,
      dataArray,
      getBySecond,
      getByTimeString,
      currentSecond,
      currentLabels,
      isPlaying,
      startSecond,
      endSecond,
      startTimeString,
      endTimeString,
      visibleLabels,
      trimStart,
      trimEnd,
      totalLabels,
      visibleChartData
    ]
  );

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
};
