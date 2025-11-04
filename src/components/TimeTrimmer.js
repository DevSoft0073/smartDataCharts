import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTelemetry } from "../context/TelemetryContext";

export default function TimeTrimmer() {

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
  } = useTelemetry();

  const containerRef = useRef(null);
  const [range, setRange] = useState({ start: 0, end: 100 });
  const [pinPercent, setPinPercent] = useState(0);
  const isDragging = useRef(null);
  const isDraggingPin = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const primaryColor = "#ebc62a";

  // Wait until telemetry values are ready
  const isReady = useMemo(
    () => startSecond != null && endSecond != null && endSecond > startSecond,
    [startSecond, endSecond]
  );

  const totalRangeSeconds = isReady ? endSecond - startSecond : 1;

  // Convert seconds <-> percent
  const secondsToPercent = useCallback(
    (sec) => ((sec - startSecond) / totalRangeSeconds) * 100,
    [startSecond, totalRangeSeconds]
  );

  const percentToSeconds = useCallback(
    (percent) => startSecond + (percent / 100) * totalRangeSeconds,
    [startSecond, totalRangeSeconds]
  );

  // Sync trimmer with telemetry values when data ready
  useEffect(() => {
    if (isReady && trimStart != null && trimEnd != null) {
      setRange({
        start: secondsToPercent(trimStart),
        end: secondsToPercent(trimEnd),
      });

      if (currentSecond != null) {
        setPinPercent(secondsToPercent(currentSecond));
      }
    }
  }, [
    startSecond,
    endSecond,
    trimStart,
    trimEnd,
    currentSecond,
    secondsToPercent,
    isReady,
  ]);

  // Update trim values in context when range changes
  useEffect(() => {
    if (isReady && !isDragging.current) {
      const newTrimStart = percentToSeconds(range.start);
      const newTrimEnd = percentToSeconds(range.end);

      // if (Math.abs(newTrimStart - trimStart) > 0.5) {
      //   setTrimStart(newTrimStart);
      // }
      // if (Math.abs(newTrimEnd - trimEnd) > 0.5) {
      //   setTrimEnd(newTrimEnd);
      // }
    }
  }, [range, isReady, percentToSeconds, trimStart, trimEnd, setTrimStart, setTrimEnd]);

  // --- Interactions ---
  const handleMouseDown = useCallback((handle) => (e) => {
    isDragging.current = handle;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handlePinMouseDown = useCallback((e) => {
    isDraggingPin.current = true;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current || !isReady) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      const boundedPercent = Math.max(0, Math.min(percent, 100));

      if (isDraggingPin.current) {
        setPinPercent(boundedPercent);
        const actualSeconds = percentToSeconds(boundedPercent);
        setCurrentSecond(Math.round(actualSeconds));
        return;
      }

      if (isDragging.current) {
        setRange((prev) => {
          let start = prev.start;
          let end = prev.end;

          if (isDragging.current === "start") {
            start = Math.min(Math.max(boundedPercent, 0), end - 0.2);
          } else if (isDragging.current === "end") {
            end = Math.max(Math.min(boundedPercent, 100), start + 0.2);
          }

          return { start, end };
        });
      }
    },
    [percentToSeconds, setCurrentSecond, isReady]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging.current && isReady) {
      // Update trim values when dragging ends
      const newTrimStart = percentToSeconds(range.start);
      const newTrimEnd = percentToSeconds(range.end);
      setTrimStart(Math.round(newTrimStart));
      setTrimEnd(Math.round(newTrimEnd));
    }
    isDragging.current = null;
    isDraggingPin.current = false;
  }, [isReady, range, percentToSeconds, setTrimStart, setTrimEnd]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // --- Time markers (hourly) ---
  // --- Time markers (hour + half-hour) ---
  const generateTimeMarkers = useCallback(() => {
    if (!isReady) return [];

    const markers = [];
    const totalSeconds = totalRangeSeconds;
    const totalHours = Math.ceil(totalSeconds / 3600);

    for (let i = 0; i <= totalHours; i++) {
      // Hour mark
      const hourSec = startSecond + i * 3600;
      if (hourSec <= endSecond) {
        markers.push({
          percent: secondsToPercent(hourSec),
          label: i === 0 || i === totalHours ? null : `${i.toString().padStart(2, "0")}:00`,
          isBig: true,
        });
      }

      // Half-hour mark (skip if it exceeds range)
      const halfHourSec = startSecond + i * 3600 + 1800;
      if (halfHourSec < endSecond) {
        markers.push({
          percent: secondsToPercent(halfHourSec),
          label: null, // no label for half-hour
          isBig: false,
        });
      }
    }

    return markers;
  }, [isReady, startSecond, endSecond, totalRangeSeconds, secondsToPercent]);

  const formatTime = (seconds) => {
    if (seconds == null || isNaN(seconds)) return "--:--";
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const timeMarkers = generateTimeMarkers();

  if (!isReady) {
    return (
      <Typography fontSize="0.8rem" sx={{ mt: 1, color: "#777" }}>
        Loading time data...
      </Typography>
    );
  }

  // --- UI ---
  return (
    <Box sx={{ width: "100%", userSelect: "none", mt: 0, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
          mb: 1.2,
          color: "#444",
          fontWeight: 500,
        }}
      >
        <Typography fontSize={"0.7rem"}>
        Time Range ({formatTime(startSecond)} - {formatTime(endSecond + 1)})
        </Typography>
        <Typography fontSize={"0.65rem"} sx={{ opacity: 0.5 }}>
          Drag or hover to scrub all charts
        </Typography>
      </Box>

      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          height: 46,
          background: "#ffffff",
          borderRadius: "4px",
          border: `1px solid ${primaryColor}`,
          width: "100%",
        }}
      >
        {/* Time markers */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            height: 46,
            left: 0,
            right: 0,
            pointerEvents: "none",
          }}
        >
          {timeMarkers.map((marker, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                left: `${marker.percent}%`,
                top: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: "translateX(-50%)",
              }}
            >
              <Box
                sx={{
                  width: marker.isBig ? "2px" : "1px",
                  height: marker.isBig ? "20px" : "10px",
                  background: "#d32f2f",
                  mt: marker.isBig ? "4px" : "8px",
                }}
              />
              {marker.label && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#666",
                    fontSize: "0.6rem",
                    mt: "2px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {marker.label}
                </Typography>
              )}
            </Box>
          ))}
        </Box>


        {/* Highlighted range */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${range.start}%`,
            width: `${range.end - range.start}%`,
            background: "rgba(235,198,42,0.15)",
            borderLeft: `2px solid ${primaryColor}`,
            borderRight: `2px solid ${primaryColor}`,
            borderRadius: "2px",
            pointerEvents: "none",
          }}
        />

        {/* Left handle */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translate(-100%, -50%)",
            left: `${range.start}%`,
            width: 6,
            height: 24,
            background: primaryColor,
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
            cursor: "ew-resize",
            boxShadow: `0 0 5px ${primaryColor}`,
            zIndex: 10,
          }}
          onMouseDown={handleMouseDown("start")}
        />

        {/* Right handle */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translate(50%, -50%)",
            left: `${range.end}%`,
            width: 6,
            height: 24,
            background: primaryColor,
            cursor: "ew-resize",
            boxShadow: `0 0 2px ${primaryColor}`,
            zIndex: 10,
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
          }}
          onMouseDown={handleMouseDown("end")}
        />

        {/* Draggable Pin */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-18px",
            left: `${pinPercent}%`,
            transform: "translateX(-50%)",
            cursor: "grab",
            zIndex: 18,
            "&:active": {
              cursor: "grabbing",
            },
          }}
          onMouseDown={handlePinMouseDown}
        >
          <Box
            sx={{
              width: "2px",
              height: "54px",
              background: primaryColor,
              margin: "0 auto",
            }}
          />
          <Box
            sx={{
              width: 16,
              height: 16,
              background: primaryColor,
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: `0 0 2px ${primaryColor}`,
              margin: "auto",
              mt: "-6px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}