import { useEffect, useState } from "react";

export const useTelemetryData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data/telemetryData.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error loading telemetry data", err));
  }, []);

  return data;
};
