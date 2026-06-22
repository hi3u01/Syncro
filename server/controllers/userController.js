const asyncHandler = require("../middleware/asyncHandler");
const userService = require("../services/userService");
const teamService = require("../services/teamService");
const dashboardService = require("../services/dashboardService");

const getUsers = asyncHandler(async (req, res) => {
  if (req.user.role === "admin") {
    return res.json(await userService.getAllUsers());
  }
  if (req.user.role === "coach" && req.query.role === "player") {
    return res.json(await teamService.getAllCoachPlayers(req.user._id));
  }
  return res.status(403).json({ error: "Přístup zamítnut." });
});

const getUser = asyncHandler(async (req, res) => {
  res.json(await userService.getUserById(req.params.id));
});

const updateUser = asyncHandler(async (req, res) => {
  res.json(await userService.updateUser(req.params.id, req.body));
});

const deleteUser = asyncHandler(async (req, res) => {
  res.json(await userService.deleteUser(req.params.id));
});

const getUserReports = asyncHandler(async (req, res) => {
  const reports = await userService.getPlayerReportsForCoach(
    req.params.id,
    req.user._id,
  );
  res.json(reports);
});

const getUserAnalytics = asyncHandler(async (req, res) => {
  await userService.assertCoachOwnsPlayer(req.params.id, req.user._id);
  const weeks = Number(req.query.weeks) || 8;
  const data = await dashboardService.getPlayerAnalytics(req.params.id, weeks);
  res.json(data);
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserReports,
  getUserAnalytics,
};
