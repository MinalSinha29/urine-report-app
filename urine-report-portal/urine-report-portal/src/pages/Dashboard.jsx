import { Users, FileText, CalendarCheck, AlertTriangle, UserPlus, History } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import QuickNavCard from "../components/ui/QuickNavCard";
import RecentReportsTable from "../components/dashboard/RecentReportsTable";
import Button from "../components/ui/Button";
import { DASHBOARD_STATS } from "../data/dummyReports";
import { useReportStore } from "../lib/ReportContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { listReports } = useReportStore();
  const recentReports = listReports().slice(0, 5);

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        subtitle="A snapshot of today's urinalysis activity across the department."
        actions={
          <Link to="/new-patient">
            <Button icon={UserPlus}>New Patient</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Patients"
          value={DASHBOARD_STATS.totalPatients}
          icon={Users}
          tone="ink"
        />
        <StatCard
          label="Total Reports"
          value={DASHBOARD_STATS.totalReports}
          icon={FileText}
          tone="teal"
        />
        <StatCard
          label="Today's Reports"
          value={DASHBOARD_STATS.todaysReports}
          icon={CalendarCheck}
          tone="amber"
        />
        <StatCard
          label="Abnormal Reports"
          value={DASHBOARD_STATS.abnormalReports}
          icon={AlertTriangle}
          tone="brick"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <QuickNavCard
          to="/new-patient"
          title="Register New Patient"
          description="Enter patient details and urinalysis values to generate a report."
          icon={UserPlus}
        />
        <QuickNavCard
          to="/history"
          title="Browse Patient History"
          description="Search prior patients and revisit their past reports."
          icon={History}
        />
      </div>

      <div className="mt-6">
        <RecentReportsTable reports={recentReports} />
      </div>
    </div>
  );
}
