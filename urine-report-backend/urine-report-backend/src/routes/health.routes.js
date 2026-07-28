const express = require("express");
const { pingDatabase } = require("../config/db");

const router = express.Router();

router.get("/health", async (req, res) => {
  let dbStatus = "unknown";
  try {
    await pingDatabase();
    dbStatus = "connected";
  } catch (err) {
    dbStatus = "unreachable";
  }

  res.json({
    status: "ok",
    time: new Date().toISOString(),
    database: dbStatus,
  });
});

module.exports = router;
