const { pool } = require("../config/db");

async function findByPatientId(patientId, conn = pool) {
  const [rows] = await conn.query(
    "SELECT * FROM patients WHERE patient_id = ? LIMIT 1",
    [patientId]
  );
  return rows[0] || null;
}

// Upsert: if this patient_id already exists, refresh their details
// (a patient's phone/name might legitimately change between visits)
// instead of erroring out or creating a duplicate row.
async function upsert(patient, conn = pool) {
  await conn.query(
    `INSERT INTO patients (patient_id, name, age, gender, phone)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), age = VALUES(age),
       gender = VALUES(gender), phone = VALUES(phone)`,
    [patient.patientId, patient.name, patient.age, patient.gender, patient.phone || null]
  );
  return findByPatientId(patient.patientId, conn);
}

async function count(conn = pool) {
  const [[row]] = await conn.query("SELECT COUNT(*) AS count FROM patients");
  return row.count;
}

module.exports = { findByPatientId, upsert, count };
