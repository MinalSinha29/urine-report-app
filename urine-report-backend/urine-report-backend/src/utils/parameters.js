// Mirrors frontend/src/data/parameters.js. This server-side copy is what
// Part 4 (REST APIs) will use to evaluate incoming report submissions —
// at that point the frontend's local evaluateReport() gets deleted and the
// UI just displays whatever the API returns. Keeping the two in sync until
// then; single-sourcing happens naturally once the frontend stops running
// its own copy.

const PARAMETERS = [
  { key: "glucose", label: "Glucose", unit: "mg/dL", low: 0, normalMax: 15 },
  { key: "protein", label: "Protein", unit: "mg/dL", low: 0, normalMax: 20 },
  { key: "ketones", label: "Ketones", unit: "mg/dL", low: 0, normalMax: 5 },
  { key: "blood", label: "Blood", unit: "RBC/µL", low: 0, normalMax: 5 },
  { key: "bilirubin", label: "Bilirubin", unit: "mg/dL", low: 0, normalMax: 0.4 },
  { key: "urobilinogen", label: "Urobilinogen", unit: "EU/dL", low: 0.2, normalMax: 1.0 },
  { key: "nitrite", label: "Nitrite", unit: "mg/dL", low: 0, normalMax: 0.05 },
  { key: "leukocytes", label: "Leukocytes", unit: "WBC/µL", low: 0, normalMax: 10 },
  { key: "ph", label: "pH", unit: "", low: 4.5, normalMax: 8.0 },
  { key: "specificGravity", label: "Specific Gravity", unit: "", low: 1.005, normalMax: 1.03 },
];

const STATUS = { NORMAL: "Normal", LOW: "Low", HIGH: "High" };

module.exports = { PARAMETERS, STATUS };
