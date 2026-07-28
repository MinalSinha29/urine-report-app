import { STATUS } from "../../data/parameters";

// Renders a horizontal scale with three zones (Low / Normal / High) and a
// marker for where the patient's value falls. This is the visual anchor of
// the report: it turns "Glucose: High" into something a clinician can read
// at a glance, echoing the original project's goal of replacing a printed
// color chart with an objective, continuous readout.
export default function ParameterRangeBar({ param, status }) {
  const { low, normalMax, value } = param;
  const span = Math.max(normalMax - low, 0.0001);

  const lowZoneStart = low - span * 0.4;
  const highZoneEnd = normalMax + span * 0.6;
  const total = highZoneEnd - lowZoneStart;

  const lowZonePct = ((low - lowZoneStart) / total) * 100;
  const normalZonePct = ((normalMax - low) / total) * 100;

  const numericValue = Number(value);
  const clamped = Math.min(Math.max(numericValue, lowZoneStart), highZoneEnd);
  const markerPct = ((clamped - lowZoneStart) / total) * 100;

  const markerColor =
    status === STATUS.HIGH
      ? "bg-brick-600"
      : status === STATUS.LOW
      ? "bg-amber-600"
      : "bg-teal-600";

  return (
    <div className="w-full">
      <div className="relative h-2 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-amber-100"
          style={{ width: `${lowZonePct}%` }}
        />
        <div
          className="h-full bg-teal-100"
          style={{ width: `${normalZonePct}%` }}
        />
        <div className="h-full bg-brick-100 flex-1" />
      </div>
      <div
        className={`relative -mt-2.5 h-2.5 w-2.5 rounded-full ${markerColor} ring-2 ring-white shadow`}
        style={{ marginLeft: `calc(${markerPct}% - 5px)` }}
      />
    </div>
  );
}
