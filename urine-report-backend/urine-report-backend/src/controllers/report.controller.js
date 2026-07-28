const reportModel = require("../models/report.model");
const { evaluateReport } = require("../utils/evaluateReport");
const { PARAMETERS } = require("../utils/parameters");
const { ApiError } = require("../middleware/errorHandler");

async function createReport(req, res) {
  const { patientId, name, age, gender, phone, date, ...rest } = req.body;

  if (!patientId || !name || !age || !gender || !date) {
    throw new ApiError(400, "patientId, name, age, gender, and date are required");
  }

  const values = {};
  for (const param of PARAMETERS) {
    const raw = rest[param.key];
    if (raw === undefined || raw === null || raw === "") {
      throw new ApiError(400, `Missing value for parameter: ${param.key}`);
    }
    values[param.key] = raw;
  }

  // The evaluation runs here, server-side, against the same reference
  // ranges — this is the only place a report's status is decided. A
  // client submitting doctored values still gets an honest evaluation.
  const evaluation = evaluateReport(values);

  const { reportId } = await reportModel.create({
    patient: { patientId, name, age, gender, phone },
    doctorId: req.doctor.id,
    doctorName: req.doctor.name,
    date,
    evaluation,
  });

  const fullReport = await reportModel.getByReportId(reportId);
  res.status(201).json(fullReport);
}

async function listReports(req, res) {
  const { search } = req.query;
  const reports = await reportModel.list({ search });
  res.json(reports);
}

async function getReport(req, res) {
  const report = await reportModel.getByReportId(req.params.reportId);
  if (!report) {
    throw new ApiError(404, `No report found with ID ${req.params.reportId}`);
  }
  res.json(report);
}

async function deleteReport(req, res) {
  const deleted = await reportModel.deleteByReportId(req.params.reportId);
  if (!deleted) {
    throw new ApiError(404, `No report found with ID ${req.params.reportId}`);
  }
  res.status(204).send();
}

module.exports = { createReport, listReports, getReport, deleteReport };
