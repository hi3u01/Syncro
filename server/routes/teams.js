const express = require("express");
const router = express.Router();
const { protect, coachOnly } = require("../middleware/auth");
const {
  createTeam,
  getCoachTeams,
  getAllPlayers,
  getPlayersByTeam,
} = require("../controllers/teamController");

router.post("/", protect, coachOnly, createTeam);
router.get("/", protect, coachOnly, getCoachTeams);
router.get("/players/list", protect, coachOnly, getAllPlayers);
router.get("/:teamId/players", protect, getPlayersByTeam);
module.exports = router;
