const express = require("express");
const router = express.Router();
const { protect, coachOnly, authorize } = require("../middleware/auth");
const {
  createTeam,
  getCoachTeams,
  getTeam,
  updateTeam,
  joinTeam,
  removePlayer,
  getTeamPlayers,
  getTeamEvents,
  getTeamDashboard,
} = require("../controllers/teamController");

router.post("/", protect, coachOnly, createTeam);
router.get("/", protect, coachOnly, getCoachTeams);
router.post("/join", protect, authorize("player"), joinTeam);
router.get("/:id", protect, coachOnly, getTeam);
router.patch("/:id", protect, coachOnly, updateTeam);
router.get("/:id/players", protect, coachOnly, getTeamPlayers);
router.get("/:id/events", protect, coachOnly, getTeamEvents);
router.get("/:id/dashboard", protect, coachOnly, getTeamDashboard);
router.delete("/:teamId/players/:playerId", protect, coachOnly, removePlayer);

module.exports = router;
