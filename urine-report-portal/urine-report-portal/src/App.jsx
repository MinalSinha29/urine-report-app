import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import NewPatient from "./pages/NewPatient";
import Report from "./pages/Report";
import PatientHistory from "./pages/PatientHistory";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new-patient" element={<NewPatient />} />
        <Route path="/report/:reportId" element={<Report />} />
        <Route path="/history" element={<PatientHistory />} />
      </Route>
    </Routes>
  );
}
