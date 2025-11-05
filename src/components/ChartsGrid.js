import { Box, Typography } from "@mui/material";
import React, { useMemo, memo, useRef, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useTelemetry } from "../context/TelemetryContext";

// Lazy loaded chart component - only renders when visible
const LazyChart = memo(({ color, filteredData, chartType }) => {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);


  const {
    currentSecond,
  } = useTelemetry();


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.01,
      }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const h = hrs.toString().padStart(2, "0");
    const m = mins.toString().padStart(2, "0");
    const s = secs.toString().padStart(2, "0");

    return `${h}:${m}`;

  };


  return (
    <div
      ref={chartRef}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "0",
        padding: "8px 16px",
        borderBottom: "1px solid #e2e8f0",
        minHeight: "132px", // Reserve space
      }}
    >
      {/* Header - Always visible */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
      </div>


      {/* Chart - Only render when visible */}
      {isVisible ? (
        <>
          {/* {chartType === 'digital' ? (
            <></>
           <ResponsiveContainer width="100%" height={200}>
           <LineChart
             data={filteredData}
             syncId="speedSync"
             margin={{ top: 10, right: 120, left: 10, bottom: 10 }}
           >

             <CartesianGrid strokeDasharray="1 1" stroke="#e2e8f0" />
       
             <XAxis
               dataKey="second"
               domain={["auto", "auto"]}
               tick={{ fill: "#475569", fontSize: 10 }}
               stroke="#cbd5e1"
               tickLine={false}
               axisLine={{ stroke: "#e2e8f0" }}
               tickFormatter={(s) => {
                 const h = Math.floor(s / 3600);
                 const m = Math.floor((s % 3600) / 60);
                 const sec = s % 60;
                 return `${String(h).padStart(2, "0")}:${String(m).padStart(
                   2,
                   "0"
                 )}:${String(sec).padStart(2, "0")}`;
               }}
             />
       
             <YAxis
               type="number"
               domain={[0, Object.keys(filteredData[0]?.digitalStatus || {}).filter((k) => !k.includes("_color")).length]}
               tickFormatter={(val) =>
                 Object.keys(filteredData[0]?.digitalStatus || {}).filter(
                   (k) => !k.includes("_color")
                 )[val - 1] || ""
               }
               tick={{ fill: "#475569", fontSize: 10 }}
               stroke="#cbd5e1"
               tickLine={false}
               axisLine={false}
               width={100}
             />
       
       
             {Object.keys(filteredData[0]?.digitalStatus || {})
               .filter((k) => !k.includes("_color"))
               .map((key, idx) => (
                 <Line
                   key={key}
                   type="stepAfter"
                   dataKey={(d) =>
                     d.digitalStatus[key] === "ON" ? idx + 1 : idx
                   }
                   stroke={filteredData[0].digitalStatus[`${key}_color`]}
                   strokeWidth={2}
                   dot={false}
                   isAnimationActive={false}
                 />
               ))}
       

             {Object.keys(filteredData[0]?.digitalStatus || {})
               .filter((k) => !k.includes("_color"))
               .map((key, idx) => {
                 const lastStatus =
                   filteredData[filteredData.length - 1]?.digitalStatus[key];
                 const color =
                   filteredData[filteredData.length - 1]?.digitalStatus[`${key}_color`];
       
                 return (
                   <g key={`status-${key}`}>
                     <rect
                       x="98%"
                       y={(idx + 1) * 25 - 10}
                       width="50"
                       height="20"
                       rx="6"
                       fill="#fff"
                       stroke={color}
                       strokeWidth="1"
                     />
                     <text
                       x="98%"
                       y={(idx + 1) * 25 + 4}
                       textAnchor="end"
                       fill={color}
                       style={{ fontSize: 12, fontWeight: 600 }}
                     >
                       {`${key.split("(")[0].trim()}: ${lastStatus}`}
                     </text>
                   </g>
                 );
               })}
           </LineChart>
         </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={filteredData}
                syncId="speedSync"
                syncMethod={'value'}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >

                <CartesianGrid
                  strokeDasharray="1 1"
                  stroke="#e2e8f0"
                  horizontal={true}
                  vertical={true}
                />

                <XAxis
                  dataKey="second"
                  domain={['auto', 'auto']}
                  tick={{ fill: "#475569", fontSize: 10 }}
                  stroke="#cbd5e1"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickFormatter={formatTime}
                />

                <YAxis
                  dataKey="maxValue"
                  domain={[0, "auto"]}
                  tick={{ fill: "#475569", fontSize: 10 }}
                  stroke="#cbd5e1"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  width={45}
                />


                <Line
                  type="stepAfter"
                  dataKey="maxValue"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )} */}

          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={filteredData}
              syncId="speedSync"
              syncMethod={'value'}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              {/* Grid lines - both horizontal and vertical */}
              <CartesianGrid
                strokeDasharray="1 1"
                stroke="#e2e8f0"
                horizontal={true}
                vertical={true}
              />

              {/* X Axis */}
              <XAxis
                dataKey="second"
                domain={['auto', 'auto']}
                tick={{ fill: "#475569", fontSize: 10 }}
                stroke="#cbd5e1"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tickFormatter={formatTime}
              />

              {/* Y Axis */}
              <YAxis
                dataKey="maxValue"
                domain={[0, "auto"]}
                tick={{ fill: "#475569", fontSize: 10 }}
                stroke="#cbd5e1"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                width={45}
              />


              <Line
                type="stepAfter"
                dataKey="maxValue"
                stroke={color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />

              <ReferenceLine
                y={currentSecond}
                stroke="red"
                strokeDasharray="4 4"
                label={{
                  value: "Threshold 50",
                  position: "right",
                  fill: "#475569",
                  fontSize: 10,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div
          style={{
            height: "100px",
            background: "#f8fafc",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontSize: "0.875rem",
          }}
        >
          Loading chart...
        </div>
      )}
    </div>
  );
});

LazyChart.displayName = 'LazyChart';

export default function ChartsGrid({ data = [], startTime, endTime, currentTime, visibleVehicles }) {

  const {
    currentSecond,
    setCurrentSecond,
    startSecond,
    endSecond,
    startTimeString,
    endTimeString,
    trimStart,
    trimEnd,
    setTrimStart,
    setTrimEnd,
    visibleLabels,
    dataArray,
    visibleChartData
  } = useTelemetry();

  // const [debouncedCurrentSecond, setDebouncedCurrentSecond] = useState(currentSecond);

  // useEffect(() => {
  //   // Debounce timer - update after 300ms of no changes
  //   const timer = setTimeout(() => {
  //     setDebouncedCurrentSecond(currentSecond);
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [currentSecond]);

  // const vehicles = useMemo(() => {
  //   const colors = [
  //     "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
  //     "#06b6d4", "#84cc16", "#f97316", "#6366f1", "#14b8a6", "#a855f7",
  //     "#22c55e", "#eab308", "#f43f5e", "#0ea5e9", "#d946ef", "#7c3aed",
  //     "#64748b", "#fb923c", "#4ade80", "#facc15", "#fb7185", "#38bdf8",
  //   ];

  //   return Array.from({ length: 52 }, (_, i) => ({
  //     name: `Vehicle ${String(i + 1).padStart(2, '0')}`,
  //     color: colors[i % colors.length]
  //   }));
  // }, []);

  // const formatTime = useMemo(() => (timestamp) => {
  //   const d = new Date(timestamp);
  //   return `${String(d.getHours()).padStart(2, "0")}:${String(
  //     d.getMinutes()
  //   ).padStart(2, "0")}`;
  // }, []);

  // const domain = useMemo(() => {
  //   if (!data || data.length === 0) {
  //     const now = new Date();
  //     const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
  //     const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();
  //     return [startOfDay, endOfDay];
  //   }

  //   const start = startTime
  //     ? new Date(startTime).getTime()
  //     : new Date(data[0].timestamp).setHours(0, 0, 0, 0);

  //   const end = endTime
  //     ? new Date(endTime).getTime()
  //     : new Date(data[0].timestamp).setHours(23, 59, 59, 999);

  //   return [start, end];
  // }, [startTime, endTime, data]);

  // const filteredData = useMemo(() => {
  //   if (!data || data.length === 0) return [];

  //   let filtered = data;
  //   if (startTime && endTime) {
  //     const start = new Date(startTime).getTime();
  //     const end = new Date(endTime).getTime();
  //     filtered = data.filter((d) => {
  //       const t = new Date(d.timestamp).getTime();
  //       return t >= start && t <= end;
  //     });
  //   }

  //   return filtered.map(d => ({
  //     ...d,
  //     timestamp: new Date(d.timestamp).getTime()
  //   }));
  // }, [data, startTime, endTime]);

  // const current = useMemo(() => {
  //   return currentTime ? new Date(currentTime).getTime() : null;
  // }, [currentTime]);

  // const xTicks = useMemo(() => {
  //   const ticks = [];
  //   const [start, end] = domain;
  //   for (let t = start; t <= end; t += 3600000) {
  //     ticks.push(t);
  //   }
  //   return ticks;
  // }, [domain]);

  const isReady = useMemo(
    () => startSecond != null && endSecond != null && endSecond > startSecond,
    [startSecond, endSecond]
  );

  if (!isReady) {
    return (
      <Typography fontSize="0.8rem" sx={{ mt: 1, color: "#777" }}>
        Loading charts data...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "#ffffff",
        mt: 4,
        flex: 1,
        overflowY: "auto",
      }}
    >
      {(visibleChartData).map(({ label, data, chartType }) => {
        // Memoize the current data point to avoid recalculating in JSX
        const currentDataPoint = data.find(item => item.second === currentSecond) || {};
        const { avgValue = 0, minValue = 0, maxValue = 0 } = currentDataPoint;

        return (
          <Box
            key={label}
            sx={{
              width: "100%",
              userSelect: "none",
              mt: 0,
              position: "relative",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#e5e7eb",
              borderRadius: "4px",
              // p: 2,
            }}
          >
            {/* Header Row */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mt: 1,
                mb: 1.2,
                color: "#444",
                fontWeight: 500,
                ml: 2,
                mr: 2
                // p:2
              }}
            >
              <Typography variant="h6" sx={{ color: data[0]?.chartColor || "#3b82f6" }} >
                {label}
              </Typography>

              <Box sx={{ display: "flex", gap: "12px" }}>
                {[
                  { label: "Avg", value: avgValue },
                  { label: "Min", value: minValue },
                  { label: "Max", value: maxValue },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      // px: 1,
                      py: 0.5,
                      minWidth: 40,
                    }}
                  >
                    <Typography fontSize={"0.6rem"} sx={{ opacity: 0.6 }}>
                      {item.label}
                    </Typography>
                    <Typography fontSize={"0.7rem"} fontWeight={500}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Chart */}
            <Box>
              <LazyChart
                key={label.name}
                color={data[0]?.chartColor || "#3b82f6"}
                vehicleName={label.name}
                filteredData={data}
                chartType={data[0]?.chartType ?? "analog"}
              />
            </Box>
          </Box>
        )
      })}
    </Box>
  );
}