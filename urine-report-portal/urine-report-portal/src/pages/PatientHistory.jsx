import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, Trash2, SearchX } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import StatusPill from "../components/ui/StatusPill";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useReportStore } from "../lib/ReportContext";

export default function PatientHistory() {
  const { listReports, deleteReport } = useReportStore();
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const reports = listReports();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) =>
      [r.id, r.patient.name, r.patient.patientId, r.patient.doctor]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [reports, query]);

  const confirmDelete = () => {
    deleteReport(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Records"
        title="Patient History"
        subtitle="Search, review, and manage previously generated reports."
      />

      <Card padding="p-0" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-mist-200">
          <div className="flex items-center gap-2 rounded-xl bg-mist-100 px-3.5 py-2.5 max-w-md">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by patient name, ID, or report ID..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist-100 text-slate-400 mb-4">
              <SearchX size={20} />
            </div>
            <p className="font-medium text-slate-900">No reports found</p>
            <p className="text-sm text-slate-500 mt-1">
              Try a different name, patient ID, or report ID.
            </p>
          </div>
        ) : (
          <>
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
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-mist-50 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-data text-slate-700">
                        {r.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-900">
                          {r.patient.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {r.patient.patientId} · {r.patient.age}y ·{" "}
                          {r.patient.gender}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {r.patient.doctor}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {r.patient.date}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={r.overallStatus}>
                          {r.overallAssessment}
                        </StatusPill>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/report/${r.id}`}
                            className="text-slate-400 hover:text-ink-900 inline-flex"
                            title="Open report"
                          >
                            <ChevronRight size={18} />
                          </Link>
                          <button
                            onClick={() => setPendingDelete(r)}
                            className="text-slate-400 hover:text-brick-600 inline-flex"
                            title="Delete report"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-mist-200">
              {filtered.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-5 py-4">
                  <Link to={`/report/${r.id}`} className="flex-1 min-w-0">
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
                  </Link>
                  <button
                    onClick={() => setPendingDelete(r)}
                    className="text-slate-400 hover:text-brick-600 p-2 shrink-0"
                    title="Delete report"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this report?"
        description={
          pendingDelete
            ? `${pendingDelete.id} for ${pendingDelete.patient.name} will be permanently removed from this session. This can't be undone.`
            : ""
        }
        confirmLabel="Delete Report"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
