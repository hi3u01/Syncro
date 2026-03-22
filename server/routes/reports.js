const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const { protect } = require("../middleware/auth");

// POST - Create a new report
router.post("/", protect, async (req, res) => {
  try {
    const newReport = new Report({
      ...req.body,
      playerId: req.user._id,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Get all reports for a user
router.get("/all", protect, async (req, res) => {
  try {
    const reports = await Report.find({ playerId: req.user._id }).sort({
      date: -1,
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
