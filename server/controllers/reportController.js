const Report = require("../models/Report");

// POST - Create a new report
const createReport = async (req, res) => {
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
};

// GET - Get all reports for a user
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ playerId: req.user._id }).sort({
      date: -1,
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createReport,
  getReports,
};
