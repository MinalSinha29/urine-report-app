const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", requireAuth, dashboardController.getStats);

module.exports = router;
