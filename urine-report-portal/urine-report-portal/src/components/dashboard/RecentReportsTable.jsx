import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Card from "../ui/Card";
import StatusPill from "../ui/StatusPill";

// Consumes the canonical report shape (id, patient, overallStatus,
// overallAssessment) — the same shape used by ReportContext everywhere,
// so this table works identically on the Dashboard and History pages.
export default function RecentReportsTable({ reports }) {
  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-mist-200">
        <h2 className="font-display font-bold text-slate-900">
          Recent Reports
        </h2>
        <Link
          to="/history"
          className="text-sm font-semibold text-ink-700 hover:text-ink-900"
        >
          View all
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 bg-mist-50">
              <th className="px-5 py-3">Report ID</th>
              <th className="px-5 py-3">Patient</th>
              <th className="px-5 py-3">Doctor</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-200">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-mist-50 transition-colors">
                <td className="px-5 py-3.5 font-data text-slate-700">
                  {r.id}
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate-900">
                    {r.patient.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {r.patient.patientId} · {r.patient.age}y · {r.patient.gender}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{r.patient.doctor}</td>
                <td className="px-5 py-3.5 text-slate-600">{r.patient.date}</td>
                <td className="px-5 py-3.5">
                  <StatusPill status={r.overallStatus}>
                    {r.overallAssessment}
                  </StatusPill>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    to={`/report/${r.id}`}
                    className="text-slate-400 hover:text-ink-900 inline-flex"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-mist-200">
        {reports.map((r) => (
          <Link
            to={`/report/${r.id}`}
            key={r.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">
                {r.patient.name}
              </p>
              <p className="text-xs text-slate-500 font-data mt-0.5">
                {r.id} · {r.patient.date}
              </p>
              <div className="mt-2">
                <StatusPill status={r.overallStatus}>
                  {r.overallAssessment}
                </StatusPill>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 shrink-0" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
