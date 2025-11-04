import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTelemetry } from "../context/TelemetryContext";

export default function AdditionalFilterDrawer({ vehicles }) {
  const [open, setOpen] = useState(false);
  const { visibleLabels, setVisibleLabels } = useTelemetry();

  // Local state (so user can change before Apply)
  const [localLabels, setLocalLabels] = useState([]);

  const handleOpen = () => {
    setLocalLabels(visibleLabels); // copy current
    setOpen(true);
  };

  const handleToggle = (name) => {
    setLocalLabels((prev) =>
      prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]
    );
  };

  const handleSelectAll = () => {
    setLocalLabels(vehicles.map((v) => v.name));
  };

  const handleUnselectAll = () => {
    setLocalLabels([]);
  };

  const handleApply = () => {
    setOpen(false);
    setVisibleLabels([])
    setTimeout(() => {
      setVisibleLabels(localLabels)
    }, 200);
  
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        sx={{
          borderRadius: "6px",
          textTransform: "none",
          fontWeight: 500,
          color: "#fff",
          backgroundColor: "#6b7280",
          "&:hover": { backgroundColor: "#4b5563" },
        }}
        onClick={handleOpen}
      >
        Additional Filter
      </Button>

      {/* ---------- Right Side Drawer ---------- */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: "#f8fafc",
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* ---------- Header ---------- */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#334155" }}>
            Filter by Label
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* ---------- Select/Unselect Buttons ---------- */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSelectAll}
            sx={{ textTransform: "none" }}
          >
            Select All
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={handleUnselectAll}
            sx={{ textTransform: "none" }}
          >
            Unselect All
          </Button>
        </Box>

        {/* ---------- Scrollable Filter List ---------- */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pr: 1.5,
            pl: 1.5, // ✅ more space on left
            pb: 10, // space for bottom button
          }}
        >
          <FormGroup>
            {vehicles.map((v) => (
              <FormControlLabel
                key={v.name}
                control={
                  <Checkbox
                    checked={localLabels.includes(v.name)}
                    onChange={() => handleToggle(v.name)}
                    size="small"
                    sx={{
                      color: v.color,
                      "&.Mui-checked": { color: v.color },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.85rem", color: "#334155" }}>
                    {v.name}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </Box>


        <Box
          sx={{
            position: "sticky",
            bottom: 8,
            left: 0,
            right: 0,
            py: 1.5,
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleApply}
            sx={{
              width: "90%",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            Apply Filter
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
