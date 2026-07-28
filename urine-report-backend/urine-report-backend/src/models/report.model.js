const { pool } = require("../config/db");
const patientModel = require("./patient.model");

function generateReportId() {
  const year = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `RPT-${year}-${n}`;
}

// Creates the patient (if needed), the report row, and all 10 parameter
// rows as a single transaction — either the whole report is saved, or
// none of it is. Retries the report ID on the rare collision.
async function create({ patient, doctorId, doctorName, date, evaluation }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const patientRow = await patientModel.upsert(patient, conn);

    let reportId = generateReportId();
    let attempts = 0;
    while (attempts < 5) {
      try {
        const [result] = await conn.query(
          `INSERT INTO reports
             (report_id, patient_id, doctor_id, doctor_name, report_date, overall_status, overall_assessment, flags)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            reportId,
            patientRow.id,
            doctorId,
            doctorName,
            date,
            evaluation.overallStatus,
            evaluation.overallAssessment,
            JSON.stringify(evaluation.flags),
          ]
        );

        const reportRowId = result.insertId;

        for (const r of evaluation.results) {
          await conn.query(
            `INSERT INTO report_parameters
               (report_id, param_key, label, unit, value, low_value, normal_max, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [reportRowId, r.key, r.label, r.unit, r.value, r.low, r.normalMax, r.status]
          );
        }

        await conn.commit();
        return { reportId, patient: patientRow };
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY" && attempts < 4) {
          reportId = generateReportId();
          attempts += 1;
          continue;
        }
        throw err;
      }
    }
    throw new Error("Could not generate a unique report ID");
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Returns summary rows (no per-parameter detail) — used by the list view
// and dashboard, joined with patients so the UI doesn't need a second call.
async function list({ search } = {}) {
  let sql = `
    SELECT r.report_id AS id, r.report_date, r.overall_status, r.overall_assessment,
           r.doctor_name, p.patient_id, p.name, p.age, p.gender
    FROM reports r
    JOIN patients p ON p.id = r.patient_id
  `;
  const params = [];

  if (search) {
    sql += ` WHERE r.report_id LIKE ? OR p.name LIKE ? OR p.patient_id LIKE ?`;
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  sql += " ORDER BY r.report_date DESC, r.id DESC";

  const [rows] = await pool.query(sql, params);
  return rows.map(toSummaryShape);
}

async function getByReportId(reportId) {
  const [[reportRow]] = await pool.query(
    `SELECT r.*, p.patient_id, p.name, p.age, p.gender, p.phone
     FROM reports r
     JOIN patients p ON p.id = r.patient_id
     WHERE r.report_id = ?
     LIMIT 1`,
    [reportId]
  );
  if (!reportRow) return null;

  const [paramRows] = await pool.query(
    `SELECT param_key, label, unit, value, low_value, normal_max, status
     FROM report_parameters WHERE report_id = ?`,
    [reportRow.id]
  );

  return toDetailShape(reportRow, paramRows);
}

async function deleteByReportId(reportId) {
  const [result] = await pool.query("DELETE FROM reports WHERE report_id = ?", [reportId]);
  return result.affectedRows > 0;
}

async function dashboardStats() {
  const [[totals]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM patients) AS totalPatients,
      (SELECT COUNT(*) FROM reports) AS totalReports,
      (SELECT COUNT(*) FROM reports WHERE report_date = CURDATE()) AS todaysReports,
      (SELECT COUNT(*) FROM reports WHERE overall_status = 'Abnormal') AS abnormalReports
  `);
  return totals;
}

function toSummaryShape(row) {
  return {
    id: row.id,
    overallStatus: row.overall_status,
    overallAssessment: row.overall_assessment,
    patient: {
      patientId: row.patient_id,
      name: row.name,
      age: row.age,
      gender: row.gender,
      doctor: row.doctor_name,
      date: row.report_date,
    },
  };
}

function toDetailShape(row, paramRows) {
  return {
    id: row.report_id,
    overallStatus: row.overall_status,
    overallAssessment: row.overall_assessment,
    flags: typeof row.flags === "string" ? JSON.parse(row.flags) : row.flags,
    patient: {
      patientId: row.patient_id,
      name: row.name,
      age: row.age,
      gender: row.gender,
      phone: row.phone,
      doctor: row.doctor_name,
      date: row.report_date,
    },
    results: paramRows.map((p) => ({
      key: p.param_key,
      label: p.label,
      unit: p.unit,
      value: Number(p.value),
      low: Number(p.low_value),
      normalMax: Number(p.normal_max),
      status: p.status,
    })),
  };
}

module.exports = { create, list, getByReportId, deleteByReportId, dashboardStats };
