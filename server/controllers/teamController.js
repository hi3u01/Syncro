const asyncHandler = require("../middleware/asyncHandler");
const teamService = require("../services/teamService");
const eventService = require("../services/eventService");
const dashboardService = require("../services/dashboardService");

const createTeam = asyncHandler(async (req, res) => {
  const team = await teamService.createTeam(req.user._id, req.body);
  res.status(201).json(team);
});

const getCoachTeams = asyncHandler(async (req, res) => {
  res.json(await teamService.getCoachTeams(req.user._id));
});

const getTeam = asyncHandler(async (req, res) => {
  res.json(await teamService.getTeamById(req.params.id, req.user._id));
});

const updateTeam = asyncHandler(async (req, res) => {
  res.json(await teamService.updateTeam(req.params.id, req.user._id, req.body));
});

const joinTeam = asyncHandler(async (req, res) => {
  const team = await teamService.joinTeam(req.user._id, req.body.joinCode);
  res.json(team);
});

const removePlayer = asyncHandler(async (req, res) => {
  const result = await teamService.removePlayer(
    req.params.teamId,
    req.params.playerId,
    req.user._id,
  );
  res.json(result);
});

const getTeamPlayers = asyncHandler(async (req, res) => {
  res.json(await teamService.getTeamPlayers(req.params.id, req.user._id));
});

const getTeamEvents = asyncHandler(async (req, res) => {
  res.json(await eventService.getTeamEvents(req.params.id, req.user._id));
});

const getTeamDashboard = asyncHandler(async (req, res) => {
  await teamService.assertCoachOwnsTeam(req.params.id, req.user._id);
  res.json(await dashboardService.getTeamDashboard(req.params.id));
});

module.exports = {
  createTeam,
  getCoachTeams,
  getTeam,
  updateTeam,
  joinTeam,
  removePlayer,
  getTeamPlayers,
  getTeamEvents,
  getTeamDashboard,
};
