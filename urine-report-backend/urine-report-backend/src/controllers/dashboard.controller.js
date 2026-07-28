const reportModel = require("../models/report.model");

async function getStats(req, res) {
  const stats = await reportModel.dashboardStats();
  res.json(stats);
}

module.exports = { getStats };
