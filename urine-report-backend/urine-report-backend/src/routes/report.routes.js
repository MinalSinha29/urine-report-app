const express = require("express");
const reportController = require("../controllers/report.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.post("/", reportController.createReport);
router.get("/", reportController.listReports);
router.get("/:reportId", reportController.getReport);
router.delete("/:reportId", reportController.deleteReport);

module.exports = router;
