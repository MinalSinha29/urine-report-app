// Placeholder data standing in for the future REST API (Phase 2).
// Instead of hardcoding pre-computed statuses, each seed patient carries
// raw parameter values and is run through the SAME evaluateReport() engine
// real submissions use. That keeps one rule engine as the only source of
// truth for status/flags, and makes every seeded report fully openable,
// printable, and deletable like a real one.

export const DASHBOARD_STATS = {
  totalPatients: 214,
  totalReports: 341,
  todaysReports: 12,
  abnormalReports: 27,
};

const normalValues = {
  glucose: 5, protein: 5, ketones: 1, blood: 1, bilirubin: 0.1,
  urobilinogen: 0.5, nitrite: 0.01, leukocytes: 3, ph: 6, specificGravity: 1.015,
};

export const SEED_REPORTS = [
  {
    id: "RPT-2026-0341",
    date: "2026-07-15",
    patient: {
      patientId: "PT-1042", name: "Anjali Rao", age: 34, gender: "Female",
      phone: "9821004512", doctor: "Dr. Ninad Mehendale", date: "2026-07-15",
    },
    values: { ...normalValues, nitrite: 0.2, leukocytes: 25, blood: 15 }, // UTI pattern
  },
  {
    id: "RPT-2026-0340",
    date: "2026-07-15",
    patient: {
      patientId: "PT-1041", name: "Suresh Iyer", age: 58, gender: "Male",
      phone: "9833221190", doctor: "Dr. Jagannath Nirmal", date: "2026-07-15",
    },
    values: { ...normalValues },
  },
  {
    id: "RPT-2026-0339",
    date: "2026-07-14",
    patient: {
      patientId: "PT-1040", name: "Meera Joshi", age: 47, gender: "Female",
      phone: "9765043321", doctor: "Dr. Ninad Mehendale", date: "2026-07-14",
    },
    values: { ...normalValues, glucose: 200, ketones: 8 }, // Diabetes pattern
  },
  {
    id: "RPT-2026-0338",
    date: "2026-07-14",
    patient: {
      patientId: "PT-1039", name: "Rohan Deshpande", age: 29, gender: "Male",
      phone: "9911223344", doctor: "Dr. Kavita Shah", date: "2026-07-14",
    },
    values: { ...normalValues },
  },
  {
    id: "RPT-2026-0337",
    date: "2026-07-13",
    patient: {
      patientId: "PT-1038", name: "Farhan Sheikh", age: 62, gender: "Male",
      phone: "9877665544", doctor: "Dr. Ninad Mehendale", date: "2026-07-13",
    },
    values: { ...normalValues, bilirubin: 1.2 }, // Liver pattern
  },
];
