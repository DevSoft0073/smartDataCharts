import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTelemetry } from "../context/TelemetryContext";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

export default function MapView() {
  const {
    dataArray,
    currentSecond,
    getBySecond,
  } = useTelemetry();

  const defaultPosition = [28.6139, 77.209]; // fallback to Delhi center

  // 🧭 Get polyline coordinates from all data
  const route = useMemo(() => {
    return dataArray
      .filter((d) => d.latitude && d.longitude)
      .map((d) => [d.latitude, d.longitude]);
  }, [dataArray]);

  // 🟡 Get current position from currentSecond
  const currentData = getBySecond(currentSecond);
  const currentPosition = currentData
    ? [currentData.latitude, currentData.longitude]
    : route.length
    ? route[0]
    : defaultPosition;

  return (
    <MapContainer
      center={currentPosition}
      zoom={15}
      style={{ height: "100%", width: "100%", borderRadius: 12 }}
    >
      {/* Base map */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* 🟢 Route line */}
      {route.length > 1 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: "blue",
            weight: 3,
            opacity: 0.8,
          }}
        />
      )}

      {/* 🟡 Current moving marker */}
      {currentPosition && (
        <Marker position={currentPosition} icon={markerIcon}>
          <Popup>
            <b>Current Position</b>
            <br />
            Lat: {currentPosition[0].toFixed(5)}
            <br />
            Lng: {currentPosition[1].toFixed(5)}
            <br />
            Second: {currentSecond}s
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
