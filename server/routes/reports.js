const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createReport, getReport } = require("../controllers/teamController");

router.post("/", protect, coachOnly, createReport);
router.get("/", protect, coachOnly, getReport);

module.exports = router;
