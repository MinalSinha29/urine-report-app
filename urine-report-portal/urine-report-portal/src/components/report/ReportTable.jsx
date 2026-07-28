import StatusPill from "../ui/StatusPill";
import ParameterRangeBar from "./ParameterRangeBar";

export default function ReportTable({ results }) {
  return (
    <div className="rounded-2xl border border-mist-200 overflow-hidden">
      {/* Desktop */}
      <table className="w-full text-sm hidden md:table">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 bg-mist-50">
            <th className="px-5 py-3 w-[18%]">Parameter</th>
            <th className="px-5 py-3 w-[14%]">Entered Value</th>
            <th className="px-5 py-3 w-[16%]">Reference Range</th>
            <th className="px-5 py-3">Distribution</th>
            <th className="px-5 py-3 w-[12%]">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mist-200">
          {results.map((r) => (
            <tr key={r.key} className="hover:bg-mist-50/70 transition-colors">
              <td className="px-5 py-4 font-medium text-slate-900">
                {r.label}
              </td>
              <td className="px-5 py-4 font-data text-slate-800">
                {r.value}
                {r.unit && (
                  <span className="text-slate-400 ml-1">{r.unit}</span>
                )}
              </td>
              <td className="px-5 py-4 font-data text-slate-500 text-xs">
                {r.low}&ndash;{r.normalMax} {r.unit}
              </td>
              <td className="px-5 py-4">
                <ParameterRangeBar param={r} status={r.status} />
              </td>
              <td className="px-5 py-4">
                <StatusPill status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="md:hidden divide-y divide-mist-200">
        {results.map((r) => (
          <div key={r.key} className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-slate-900">{r.label}</p>
              <StatusPill status={r.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-data mb-2">
              <span>
                {r.value} {r.unit}
              </span>
              <span>
                Ref: {r.low}&ndash;{r.normalMax} {r.unit}
              </span>
            </div>
            <ParameterRangeBar param={r} status={r.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
