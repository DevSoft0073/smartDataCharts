const fs = require("fs");

// Config
const SECONDS = 10800; // 12 hours = 43200 seconds
const LABEL_COUNT = 52;
const START_LAT = 28.6139;
const START_LNG = 77.2090;

const chartTypes = ["digital", "analog"];
const labelColors = ["#FF5733", "#33FF66", "#335BFF", "#FFC133", "#FF33A8", "#33FFF9"];
const chartColors = ["#33C1FF", "#FFC133", "#9D33FF", "#33FF77", "#FF3333", "#3385FF"];

// ✅ Digital sensor fixed colors
const DIGITAL_SENSORS = {
  "On-Track Status": "#FF0000",
  "Park Brake Output": "#00FF00",
  "Front Rail Gear Down": "#1E90FF",
  "Front Rail Gear Up": "#FFD700",
  "EWP Stowed": "#FF69B4",
};

const startDate = new Date("2025-11-01T00:00:00Z");
let lat = START_LAT;
let lng = START_LNG;

const randomBetween = (min, max) => +(min + Math.random() * (max - min)).toFixed(2);

// ---------- Prepare output ----------
const outputDir = "./public/data";
fs.mkdirSync(outputDir, { recursive: true });
const stream = fs.createWriteStream(`${outputDir}/telemetryData.json`);

stream.write('{\n');
stream.write(`  "date": "${startDate.toISOString().split("T")[0]}",\n`);
stream.write(`  "startTime": "${startDate.toISOString()}",\n`);
stream.write(`  "endTime": "${new Date(startDate.getTime() + SECONDS * 1000).toISOString()}",\n`);
stream.write(`  "totalSeconds": ${SECONDS},\n`);
stream.write(`  "labelCount": ${LABEL_COUNT},\n`);
stream.write(`  "digitalSensors": ${JSON.stringify(Object.keys(DIGITAL_SENSORS))},\n`);
stream.write(`  "data": [\n`);

// ---------- Generate and write chunk by chunk ----------
for (let sec = 0; sec < SECONDS; sec++) {
  lat += (Math.random() - 0.5) * 0.0001;
  lng += (Math.random() - 0.5) * 0.0001;

  // ✅ Prepare digital status values once per second
  const digitalStatus = {};
  for (const [key, color] of Object.entries(DIGITAL_SENSORS)) {
    const value = Math.random() > 0.5 ? "ON" : "OFF";
    digitalStatus[key] = value;
    digitalStatus[`${key}_color`] = color;
  }

  // ✅ Create labels and embed digital statuses in each label
  const labels = Array.from({ length: LABEL_COUNT }, (_, i) => {
    const maxValue = (sec > 200 && sec < 2000) ? 50 : (sec > 6000 && sec < 7000) ? 25 : 0//randomBetween(0, 50);
    const minValue = 0
    const avgValue = +(minValue + (maxValue - minValue) / 2).toFixed(2);
    const chartType = sec === 0 ? "digital" : "analog"//chartTypes[i % chartTypes.length];
    const labelColor = labelColors[i % labelColors.length];
    const chartColor = chartColors[i % chartColors.length];

    return {
      time: sec,
      title: `Sensor ${i + 1}`,
      maxValue,
      minValue,
      avgValue,
      chartType,
      labelColor,
      chartColor,
      digitalStatus, // ✅ saved inside each label
    };
  });

  const entry = {
    second: sec,
    timestamp: new Date(startDate.getTime() + sec * 1000).toISOString(),
    latitude: +lat.toFixed(6),
    longitude: +lng.toFixed(6),
    label: labels,
  };

  const json = JSON.stringify(entry);
  stream.write(json + (sec < SECONDS - 1 ? ",\n" : "\n"));
}

// ---------- Close JSON ----------
stream.write("  ]\n");
stream.write("}\n");

stream.end(() => {
  console.log(
    `✅ telemetryData.json (streamed) created successfully with ${SECONDS} seconds × ${LABEL_COUNT} labels (each with embedded digitalStatus)`
  );
});
