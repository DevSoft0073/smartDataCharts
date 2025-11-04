// DatePickerField.js
import React, { useState } from "react";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function DatePickerField({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleChange = (newValue) => {
    setSelectedDate(newValue);
    if (onDateChange && newValue) {
      onDateChange(newValue.toDate()); // return JS Date
    }
  };

  return (
    <Box sx={{ minWidth: 100, width:160 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={handleChange}
          format="DD-MM-YYYY"
          slotProps={{
            textField: {
              size: "small",
              sx: {
                "& .MuiInputBase-input": {
                  fontSize: "0.75rem",
                //   paddingY: 0.6,
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.75rem",
                  top:2
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "1rem",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e1",
                  fontSize: "0.75rem",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#94a3b8",
                },
                "& .MuiPickersInputBase-root .MuiInputBase-input": {
                    fontSize: "0.75rem",
                  }
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}
