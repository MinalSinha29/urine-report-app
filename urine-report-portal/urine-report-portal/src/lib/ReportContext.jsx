import { createContext, useContext, useState } from "react";
import { evaluateReport } from "./evaluateReport";
import { SEED_REPORTS } from "../data/dummyReports";

const ReportContext = createContext(null);

function buildSeedState() {
  const seeded = {};
  for (const seed of SEED_REPORTS) {
    const evaluation = evaluateReport(seed.values);
    seeded[seed.id] = {
      id: seed.id,
      patient: seed.patient,
      ...evaluation,
    };
  }
  return seeded;
}

export function ReportProvider({ children }) {
  // Keyed by reportId. Seeded with demo patients (run through the real
  // evaluation engine) so the whole app is browsable out of the box.
  // Phase 2 replaces this entirely with GET/POST/DELETE /api/reports calls.
  const [reports, setReports] = useState(buildSeedState);

  const saveReport = (reportId, reportData) => {
    setReports((prev) => ({ ...prev, [reportId]: reportData }));
  };

  const getReport = (reportId) => reports[reportId];

  const deleteReport = (reportId) => {
    setReports((prev) => {
      const next = { ...prev };
      delete next[reportId];
      return next;
    });
  };

  const listReports = () =>
    Object.values(reports).sort((a, b) =>
      b.patient.date.localeCompare(a.patient.date)
    );

  return (
    <ReportContext.Provider
      value={{ saveReport, getReport, deleteReport, listReports }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReportStore() {
  const ctx = useContext(ReportContext);
  if (!ctx) {
    throw new Error("useReportStore must be used within a ReportProvider");
  }
  return ctx;
}
