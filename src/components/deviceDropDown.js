import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function DeviceDropdown() {
  const [device, setDevice] = useState("6363298 (2131DQW12)");

  const devices = [
    "6363298 (2131DQW12)",
    "6363298 (2131DQW13)",
    "6363298 (2131DQW14)",
  ];

  const handleChange = (event) => {
    setDevice(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 160 }}>
      <FormControl
        fullWidth
        size="small"
        sx={{
          "& .MuiInputLabel-root": {
            fontSize: "0.8rem",
          },
          "& .MuiSelect-select": {
            fontSize: "0.65rem",
            py: 0.6,
            px: 1.2,
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cbd5e1",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#94a3b8",
          },
        }}
      >
        <InputLabel id="device-select-label" sx={{mt:0.2}}>Devices</InputLabel>
        <Select
          labelId="device-select-label"
          id="device-select"
          value={device}
          label="Device"
          onChange={handleChange}
        >
          {devices.map((dev) => (
            <MenuItem key={dev} value={dev} sx={{ fontSize: "0.75rem" }}>
              {dev}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
