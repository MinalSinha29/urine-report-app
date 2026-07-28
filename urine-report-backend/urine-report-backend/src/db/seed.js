require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const { evaluateReport } = require("../utils/evaluateReport");

const normalValues = {
  glucose: 5, protein: 5, ketones: 1, blood: 1, bilirubin: 0.1,
  urobilinogen: 0.5, nitrite: 0.01, leukocytes: 3, ph: 6, specificGravity: 1.015,
};

// Same five demo patients as frontend/src/data/dummyReports.js, so the app
// looks identical whether you're browsing the frontend's local demo state
// or the real API once they're wired together.
const SEED_REPORTS = [
  {
    reportId: "RPT-2026-0341", date: "2026-07-15",
    patient: { patientId: "PT-1042", name: "Anjali Rao", age: 34, gender: "Female", phone: "9821004512" },
    doctorName: "Dr. Ninad Mehendale",
    values: { ...normalValues, nitrite: 0.2, leukocytes: 25, blood: 15 }, // UTI pattern
  },
  {
    reportId: "RPT-2026-0340", date: "2026-07-15",
    patient: { patientId: "PT-1041", name: "Suresh Iyer", age: 58, gender: "Male", phone: "9833221190" },
    doctorName: "Dr. Jagannath Nirmal",
    values: { ...normalValues },
  },
  {
    reportId: "RPT-2026-0339", date: "2026-07-14",
    patient: { patientId: "PT-1040", name: "Meera Joshi", age: 47, gender: "Female", phone: "9765043321" },
    doctorName: "Dr. Ninad Mehendale",
    values: { ...normalValues, glucose: 200, ketones: 8 }, // Diabetes pattern
  },
  {
    reportId: "RPT-2026-0338", date: "2026-07-14",
    patient: { patientId: "PT-1039", name: "Rohan Deshpande", age: 29, gender: "Male", phone: "9911223344" },
    doctorName: "Dr. Kavita Shah",
    values: { ...normalValues },
  },
  {
    reportId: "RPT-2026-0337", date: "2026-07-13",
    patient: { patientId: "PT-1038", name: "Farhan Sheikh", age: 62, gender: "Male", phone: "9877665544" },
    doctorName: "Dr. Ninad Mehendale",
    values: { ...normalValues, bilirubin: 1.2 }, // Liver pattern
  },
];

async function seedDoctors(conn) {
  const passwordHash = await bcrypt.hash("password123", 10);
  const doctors = [
    { name: "Dr. Ninad Mehendale", username: "ninad.mehendale", department: "Electronics Engineering" },
    { name: "Dr. Jagannath Nirmal", username: "jagannath.nirmal", department: "Electronics Engineering" },
    { name: "Dr. Kavita Shah", username: "kavita.shah", department: "Pathology" },
  ];

  for (const doc of doctors) {
    await conn.query(
      `INSERT INTO doctors (name, username, password_hash, department)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [doc.name, doc.username, passwordHash, doc.department]
    );
  }
  console.log(`✓ Seeded ${doctors.length} doctors (password for all: "password123")`);
}

async function seedReports(conn) {
  for (const seed of SEED_REPORTS) {
    const [[doctorRow]] = await conn.query(
      "SELECT id FROM doctors WHERE name = ? LIMIT 1",
      [seed.doctorName]
    );

    const [patientResult] = await conn.query(
      `INSERT INTO patients (patient_id, name, age, gender, phone)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [seed.patient.patientId, seed.patient.name, seed.patient.age, seed.patient.gender, seed.patient.phone]
    );

    const [[patientRow]] = await conn.query(
      "SELECT id FROM patients WHERE patient_id = ? LIMIT 1",
      [seed.patient.patientId]
    );

    const evaluation = evaluateReport(seed.values);

    const [reportResult] = await conn.query(
      `INSERT INTO reports
         (report_id, patient_id, doctor_id, doctor_name, report_date, overall_status, overall_assessment, flags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE overall_status = VALUES(overall_status)`,
      [
        seed.reportId,
        patientRow.id,
        doctorRow ? doctorRow.id : null,
        seed.doctorName,
        seed.date,
        evaluation.overallStatus,
        evaluation.overallAssessment,
        JSON.stringify(evaluation.flags),
      ]
    );

    const [[reportRow]] = await conn.query(
      "SELECT id FROM reports WHERE report_id = ? LIMIT 1",
      [seed.reportId]
    );

    // Replace any previously-seeded parameter rows for this report so
    // re-running the seed script doesn't duplicate them.
    await conn.query("DELETE FROM report_parameters WHERE report_id = ?", [reportRow.id]);

    for (const r of evaluation.results) {
      await conn.query(
        `INSERT INTO report_parameters
           (report_id, param_key, label, unit, value, low_value, normal_max, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [reportRow.id, r.key, r.label, r.unit, r.value, r.low, r.normalMax, r.status]
      );
    }
  }
  console.log(`✓ Seeded ${SEED_REPORTS.length} patients with full reports`);
}

async function seed() {
  const conn = await pool.getConnection();
  try {
    await seedDoctors(conn);
    await seedReports(conn);
    console.log("✓ Done.");
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("✗ Seeding failed:");
  console.error(err.message);
  process.exit(1);
});
