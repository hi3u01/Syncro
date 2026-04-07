const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createReport,
  getReports,
  getTeamReports,
} = require("../controllers/reportController");

router.post("/", protect, createReport);
router.get("/", protect, getReports);
router.get("/team/:teamId", protect, getTeamReports);

module.exports = router;
