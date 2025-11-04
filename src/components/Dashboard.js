// src/components/Dashboard.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import ChartsGrid from "./ChartsGrid";
import TimeTrimmer from "./TimeTrimmer";
import MapView from "./MapView";
import { useTelemetryData } from "../data/useTelemetryData";
import VehicleFilter from "./VehicleFilter";
import DeviceDropdown from "./deviceDropDown";
import DatePickerField from "./datePicker";
import AdditionalFilterDrawer from "./VehicleFilter";
import { useTelemetry } from "../context/TelemetryContext";

export default function Dashboard() {
  // const [selectedPosition, setSelectedPosition] = useState([28.6139, 77.2090]); // default Delhi


  // const data = useTelemetryData();
  // const [hoveredPoint, setHoveredPoint] = useState(null);
  // const [hoverSeconds, setHoverSeconds] = useState(null); // shared hover time
  // const handleHoverTimeThrottled = useRef(null);


  // const [timeRange, setTimeRange] = useState({
  //   startTime: null,
  //   endTime: null,
  //   currentTime: null,
  // });

  const {
    currentSecond,
    currentLabels,
    startSecond,
    endSecond,
    setCurrentSecond,
    dataArray,
    visibleLabels,
    setVisibleLabels
  } = useTelemetry();

  const handleDateSelect = (date) => {
    // console.log("Selected date:", date); // JavaScript Date object
  };

  // const percentToTimestamp = (percent) => {
  //   if (!data.length) return null;
  //   const dayStart = new Date(data[0].timestamp);
  //   const totalSeconds = 24 * 60 * 60;
  //   const secondsOffset = (percent / 100) * totalSeconds;
  //   return new Date(dayStart.getTime() + secondsOffset * 1000).toISOString();
  // };


  // const handleHoverTime = (hoverSeconds = 0, startPercent = 0, endPercent = 100) => {
  //   if (!data || data.length === 0) return;

  //   const dayStart = new Date(data[0].timestamp);
  //   const totalSeconds = 24 * 60 * 60;
  //   // Convert percentages to absolute timestamps
  //   const startOffset = (startPercent / 100) * totalSeconds * 1000;
  //   const endOffset = (endPercent / 100) * totalSeconds * 1000;
  //   const hoverOffset = hoverSeconds * 1000;

  //   const startTime = new Date(dayStart.getTime() + startOffset);
  //   const endTime = new Date(dayStart.getTime() + endOffset);
  //   const hoverTime = new Date(dayStart.getTime() + hoverOffset);

  //   // Find nearest data point to hover time
  //   const nearest = data.reduce((a, b) =>
  //     Math.abs(new Date(a.timestamp) - hoverTime) <
  //       Math.abs(new Date(b.timestamp) - hoverTime)
  //       ? a
  //       : b
  //   );

  //   setHoveredPoint(nearest);
  //   setSelectedPosition([nearest.lat, nearest.lng]);
  //   setHoverSeconds(hoverSeconds);

  //   // Pass to charts
  //   setTimeRange({
  //     startTime: startTime.toISOString(),
  //     endTime: endTime.toISOString(),
  //     currentTime: hoverTime.toISOString(),
  //   });
  // };

  const vehicles = useMemo(() => {
    if (!dataArray?.length) return [];

    const firstLabels = dataArray[0]?.label || []; // get labels array from first second

    return firstLabels.map((label, index) => ({
      name: label.title || `Label ${index + 1}`,
      color: label.labelColor || "#999999",
      chartType: label.chartType,
      chartColor: label.chartColor,
      maxValue: label.maxValue,
      minValue: label.minValue,
      avgValue: label.avgValue,
    }));
  }, [dataArray]);


  const [selectedVehicles, setSelectedVehicles] = useState(
    vehicles.map((v) => v.name) // All selected by default
  );


  useEffect(() => {
    if (vehicles.length && visibleLabels.length === 0) {
      setVisibleLabels(vehicles.map((v) => v.name));
    }
  }, [vehicles]);




  // useEffect(() => {
  //   let lastCall = 0;
  //   handleHoverTimeThrottled.current = (hoverSeconds, startPercent, endPercent) => {
  //     const now = Date.now();
  //     if (now - lastCall < 50) return; // Only update every 50ms
  //     lastCall = now;
  //     handleHoverTime(hoverSeconds, startPercent, endPercent);
  //   };
  // }, [handleHoverTime]);


  const formatTime = (seconds) => {
    if (seconds == null || isNaN(seconds)) return "--:--:--";
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const secs = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };
  return (
    <Box sx={{ bgcolor: '#fff' }}>

      <Box
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          alignItems: "center",
          borderBottom: 1,
          borderBottomColor: "#e5e7eb",
          gap: 4,
          flexWrap: "nowrap", // ensures all stay in one line without overflow
          overflow: "hidden", // prevents any accidental scroll
          boxSizing: "border-box",
        }}
      >
        {/* Left section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 1 }}>
          <Typography fontWeight="bold" noWrap>
            Charts
          </Typography>
          <DeviceDropdown />
          <DatePickerField onDateChange={handleDateSelect} />

          <AdditionalFilterDrawer
            vehicles={vehicles}
          />
        </Box>

        {/* Right section */}
        <Box
          sx={{
            marginLeft: "auto",
            flexShrink: 0,

          }}

        >
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 500,
              color: "#374151",
              backgroundColor: "#e5e7eb",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
              mr: 2
            }}
          >
            Table
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 500,
              color: "#374151",
              backgroundColor: "#e5e7eb",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
            }}
          >
            Print
          </Button>

        </Box>
      </Box>


      <Box sx={{ p: 2, height: "100vh", display: "flex", gap: 2 }}>
        <Paper sx={{ width: "20%", height: "100%" }} elevation={3}>
          <MapView />
        </Paper>

        {/* Right Charts + Trimmer */}

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
            <Typography fontWeight="medium" variant="body1" noWrap>
              Smart Data Link
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

              <Typography fontWeight="medium" fontSize={'0.75rem'} noWrap>
                TIME:
              </Typography>

              <Typography
                fontWeight="medium"
                fontSize="0.75rem"
                noWrap
                sx={{
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  px: 1,
                  py: 0.2,
                  borderRadius: "4px",
                }}
              >
                {formatTime(currentSecond)}
              </Typography>

            </Box>

          </Box>

          <Box
            sx={{
              height: 100,
              p: 1,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#e5e7eb",
              borderRadius: "4px",
            }}
          >
            {/* <TimeTrimmer onHoverTimeChange={handleHoverTimeThrottled.current} /> */}
            <TimeTrimmer />
          </Box>



          <Paper sx={{ flex: 1, p: 0, overflowY: "auto" }} elevation={0}>

            <ChartsGrid />

          </Paper>
        </Box>
      </Box>


    </Box>
  );
}
