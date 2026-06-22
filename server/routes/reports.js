const express = require("express");
const router = express.Router();
const { protect, coachOnly, authorize } = require("../middleware/auth");
const {
  createReport,
  getMyReports,
  getReport,
  deleteReport,
} = require("../controllers/reportController");

router.post("/", protect, authorize("player"), createReport);
router.get("/", protect, authorize("player"), getMyReports);
router.get("/:id", protect, getReport);
router.delete("/:id", protect, coachOnly, deleteReport);

module.exports = router;
