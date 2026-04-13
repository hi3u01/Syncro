const User = require("../models/User");
const Team = require("../models/Team");
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

const getTeamReports = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    // Check if the coach has access to this team
    const team = await Team.findOne({ _id: teamId, coachId: req.user._id });
    if (!team) {
      return res
        .status(403)
        .json({ message: "Nemáte přístup k tomuto týmu nebo tým neexistuje." });
    }
    const players = await User.find({ teamId: teamId, role: "player" });
    const playerIds = players.map((p) => p._id);

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 15);

    const reports = await Report.find({
      playerId: { $in: playerIds },
      date: { $gte: dateLimit },
    })
      .populate("playerId", "firstName lastName")
      .populate("eventId", "type title date");

    res.json(reports);
  } catch (err) {
    console.error("Backend chyba v getTeamReports:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createReport,
  getReports,
  getTeamReports,
};
