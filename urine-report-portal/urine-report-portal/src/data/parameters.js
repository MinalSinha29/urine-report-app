// Reference-range definitions for the 10 urinalysis parameters.
// This is the single source of truth: the evaluation engine (Phase 3) and
// every UI surface (report tables, mini range-bars, dashboard flags) all
// read from here, so a range only ever needs to change in one place.

export const PARAMETERS = [
  { key: "glucose", label: "Glucose", unit: "mg/dL", low: 0, normalMax: 15 },
  { key: "protein", label: "Protein", unit: "mg/dL", low: 0, normalMax: 20 },
  { key: "ketones", label: "Ketones", unit: "mg/dL", low: 0, normalMax: 5 },
  { key: "blood", label: "Blood", unit: "RBC/µL", low: 0, normalMax: 5 },
  { key: "bilirubin", label: "Bilirubin", unit: "mg/dL", low: 0, normalMax: 0.4 },
  { key: "urobilinogen", label: "Urobilinogen", unit: "EU/dL", low: 0.2, normalMax: 1.0 },
  { key: "nitrite", label: "Nitrite", unit: "mg/dL", low: 0, normalMax: 0.05 },
  { key: "leukocytes", label: "Leukocytes", unit: "WBC/µL", low: 0, normalMax: 10 },
  { key: "ph", label: "pH", unit: "", low: 4.5, normalMax: 8.0 },
  { key: "specificGravity", label: "Specific Gravity", unit: "", low: 1.005, normalMax: 1.030 },
];

export const STATUS = {
  NORMAL: "Normal",
  LOW: "Low",
  HIGH: "High",
};
