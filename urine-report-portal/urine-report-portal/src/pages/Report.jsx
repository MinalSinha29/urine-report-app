import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Printer, ArrowLeft, FileX2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ReportTable from "../components/report/ReportTable";
import OverallAssessmentCard from "../components/report/OverallAssessmentCard";
import { useReportStore } from "../lib/ReportContext";

export default function Report() {
  const { reportId } = useParams();
  const { getReport } = useReportStore();
  const report = getReport(reportId);
  const printableRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(printableRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${reportId}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  if (!report) {
    return (
      <Card className="max-w-lg mx-auto text-center py-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mist-100 text-slate-400 mb-4">
          <FileX2 size={22} />
        </div>
        <h1 className="font-display font-bold text-slate-900 mb-1">
          Report not found
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          <span className="font-data">{reportId}</span> isn't in this
          session's store yet. Reports aren't persisted to a database until
          Phase 2 — dummy dashboard entries won't resolve to real data.
        </p>
        <Link to="/new-patient">
          <Button>Generate a new report</Button>
        </Link>
      </Card>
    );
  }

  const { patient, results, overallStatus, overallAssessment, flags } = report;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="no-print">
        <PageHeader
          eyebrow="Report"
          title={`Report ${report.id}`}
          subtitle="Generated from entered urinalysis values against clinical reference ranges."
          actions={
            <>
              <Link to="/new-patient">
                <Button variant="ghost" icon={ArrowLeft}>
                  Back
                </Button>
              </Link>
              <Button variant="secondary" icon={Printer} onClick={handlePrint}>
                Print
              </Button>
              <Button
                icon={Download}
                onClick={handleDownloadPdf}
                disabled={exporting}
              >
                {exporting ? "Preparing..." : "Download PDF"}
              </Button>
            </>
          }
        />
      </div>

      <div id="printable-report" ref={printableRef} className="space-y-6">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Patient
              </p>
              <p className="font-display text-lg font-bold text-slate-900 mt-0.5">
                {patient.name}
              </p>
              <p className="text-sm text-slate-500 font-data mt-0.5">
                {patient.patientId} · {patient.age}y · {patient.gender}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <span className="text-slate-500">Report ID</span>
              <span className="font-data text-slate-800">{report.id}</span>
              <span className="text-slate-500">Date</span>
              <span className="text-slate-800">{patient.date}</span>
              <span className="text-slate-500">Doctor</span>
              <span className="text-slate-800">{patient.doctor}</span>
              {patient.phone && (
                <>
                  <span className="text-slate-500">Phone</span>
                  <span className="text-slate-800">{patient.phone}</span>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card padding="p-0">
          <div className="px-5 py-4 border-b border-mist-200">
            <h2 className="font-display font-bold text-slate-900">
              Urinalysis Results
            </h2>
          </div>
          <div className="p-5">
            <ReportTable results={results} />
          </div>
        </Card>

        <OverallAssessmentCard
          overallStatus={overallStatus}
          overallAssessment={overallAssessment}
          flags={flags}
        />
      </div>
    </div>
  );
}
