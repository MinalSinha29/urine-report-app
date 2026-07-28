// Rule-based evaluation engine (Phase 3 of the roadmap).
// Every value is compared against the reference ranges in data/parameters.js.
// This function is intentionally the ONLY place that decides Normal/Low/High,
// so swapping this rule engine for a trained ML model later (Phase 4) means
// changing this one function's internals — no UI code has to change.

import { PARAMETERS, STATUS } from "../data/parameters";

function statusFor(param, rawValue) {
  const value = Number(rawValue);
  if (Number.isNaN(value)) return null;

  if (value < param.low) return STATUS.LOW;
  if (value > param.normalMax) return STATUS.HIGH;
  return STATUS.NORMAL;
}

// Simple flag rules — combinations of abnormal parameters that suggest a
// possible condition. This is a starting heuristic, not a diagnosis engine;
// the UI always frames it as decision support for the reviewing clinician.
function deriveFlags(resultsByKey) {
  const flags = [];
  const isHigh = (key) => resultsByKey[key]?.status === STATUS.HIGH;

  if (isHigh("glucose") || isHigh("ketones")) {
    flags.push("Possible Diabetes");
  }
  if (isHigh("nitrite") || isHigh("leukocytes") || isHigh("blood")) {
    flags.push("Possible UTI");
  }
  if (isHigh("bilirubin") || isHigh("urobilinogen")) {
    flags.push("Possible Liver Dysfunction");
  }
  if (isHigh("protein")) {
    flags.push("Possible Kidney Involvement");
  }

  return flags;
}

/**
 * @param {Object} values - map of parameter key -> entered value (string|number)
 * @returns {{
 *   results: Array<{key, label, unit, value, low, normalMax, status}>,
 *   flags: string[],
 *   overallStatus: "Normal" | "Abnormal",
 *   overallAssessment: string
 * }}
 */
export function evaluateReport(values) {
  const results = PARAMETERS.map((param) => {
    const value = values[param.key];
    const status = statusFor(param, value);
    return {
      key: param.key,
      label: param.label,
      unit: param.unit,
      value,
      low: param.low,
      normalMax: param.normalMax,
      status,
    };
  });

  const resultsByKey = Object.fromEntries(results.map((r) => [r.key, r]));
  const flags = deriveFlags(resultsByKey);
  const hasAbnormal = results.some(
    (r) => r.status === STATUS.HIGH || r.status === STATUS.LOW
  );

  return {
    results,
    flags,
    overallStatus: hasAbnormal ? "Abnormal" : "Normal",
    overallAssessment: flags.length > 0 ? flags.join(", ") : "Normal Report",
  };
}
