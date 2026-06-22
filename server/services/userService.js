const User = require("../models/User");
const Team = require("../models/Team");
const Report = require("../models/Report");
const ApiError = require("../utils/ApiError");

const getAllUsers = () =>
  User.find().select("-password").sort({ createdAt: -1 });

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new ApiError(404, "Uživatel nebyl nalezen.");
  return user;
};

const updateUser = async (id, data) => {
  const allowed = {};
  if (typeof data.isActive === "boolean") allowed.isActive = data.isActive;
  if (data.firstName) allowed.firstName = data.firstName;
  if (data.lastName) allowed.lastName = data.lastName;

  const user = await User.findByIdAndUpdate(id, allowed, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) throw new ApiError(404, "Uživatel nebyl nalezen.");
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, "Uživatel nebyl nalezen.");
  return { message: "Uživatel byl smazán." };
};

// Confirm the coach owns the team the player belongs to
const assertCoachOwnsPlayer = async (playerId, coachId) => {
  const player = await User.findById(playerId);
  if (!player) throw new ApiError(404, "Hráč nebyl nalezen.");
  if (!player.teamId) throw new ApiError(403, "Hráč nepatří do žádného týmu.");
  const owns = await Team.exists({ _id: player.teamId, coachId });
  if (!owns) throw new ApiError(403, "K tomuto hráči nemáte přístup.");
  return player;
};

const getPlayerReportsForCoach = async (playerId, coachId) => {
  await assertCoachOwnsPlayer(playerId, coachId);
  return Report.find({ playerId })
    .sort({ date: -1 })
    .populate("eventId", "type title date plannedDuration");
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assertCoachOwnsPlayer,
  getPlayerReportsForCoach,
};
