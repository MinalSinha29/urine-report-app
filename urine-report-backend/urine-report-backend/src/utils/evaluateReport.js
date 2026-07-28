const { PARAMETERS, STATUS } = require("./parameters");

function statusFor(param, rawValue) {
  const value = Number(rawValue);
  if (Number.isNaN(value)) return null;
  if (value < param.low) return STATUS.LOW;
  if (value > param.normalMax) return STATUS.HIGH;
  return STATUS.NORMAL;
}

function deriveFlags(resultsByKey) {
  const flags = [];
  const isHigh = (key) => resultsByKey[key]?.status === STATUS.HIGH;

  if (isHigh("glucose") || isHigh("ketones")) flags.push("Possible Diabetes");
  if (isHigh("nitrite") || isHigh("leukocytes") || isHigh("blood"))
    flags.push("Possible UTI");
  if (isHigh("bilirubin") || isHigh("urobilinogen"))
    flags.push("Possible Liver Dysfunction");
  if (isHigh("protein")) flags.push("Possible Kidney Involvement");

  return flags;
}

function evaluateReport(values) {
  const results = PARAMETERS.map((param) => {
    const value = values[param.key];
    const status = statusFor(param, value);
    return {
      key: param.key,
      label: param.label,
      unit: param.unit,
      value: Number(value),
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

module.exports = { evaluateReport };
