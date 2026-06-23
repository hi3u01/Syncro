const crypto = require("crypto");
const Team = require("../models/Team");
const User = require("../models/User");
const Report = require("../models/Report");
const metrics = require("./metricsService");
const { addDays, startOfDay } = require("../utils/dates");
const ApiError = require("../utils/ApiError");

const generateUniqueJoinCode = async () => {
  let code;
  let taken = true;
  while (taken) {
    code = crypto.randomBytes(3).toString("hex").toUpperCase();
    taken = await Team.exists({ joinCode: code });
  }
  return code;
};

// Verify the team exists and belongs to this coach
const assertCoachOwnsTeam = async (teamId, coachId) => {
  const team = await Team.findOne({ _id: teamId, coachId });
  if (!team) {
    throw new ApiError(
      403,
      "Nemáte přístup k tomuto týmu nebo tým neexistuje.",
    );
  }
  return team;
};

const createTeam = async (coachId, { name }) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Název týmu je povinný.");
  }
  const joinCode = await generateUniqueJoinCode();
  return Team.create({ name: name.trim(), coachId, joinCode });
};

const getCoachTeams = (coachId) =>
  Team.find({ coachId }).sort({ createdAt: 1 });

const getTeamById = (teamId, coachId) => assertCoachOwnsTeam(teamId, coachId);

const updateTeam = async (teamId, coachId, { name }) => {
  const team = await assertCoachOwnsTeam(teamId, coachId);
  if (name && name.trim()) team.name = name.trim();
  return team.save();
};

const joinTeam = async (playerId, joinCode) => {
  if (!joinCode) throw new ApiError(400, "Zvací kód je povinný.");
  const team = await Team.findOne({ joinCode: joinCode.toUpperCase() });
  if (!team) throw new ApiError(400, "Neplatný zvací kód týmu.");
  await User.findByIdAndUpdate(playerId, { teamId: team._id });
  return team;
};

const removePlayer = async (teamId, playerId, coachId) => {
  await assertCoachOwnsTeam(teamId, coachId);
  const player = await User.findOne({ _id: playerId, teamId });
  if (!player) throw new ApiError(404, "Hráč v tomto týmu nebyl nalezen.");
  player.teamId = null;
  await player.save();
  return { message: "Hráč byl odebrán z týmu." };
};

const getTeamPlayers = async (teamId, coachId) => {
  await assertCoachOwnsTeam(teamId, coachId);
  return User.find({ role: "player", teamId }).select("-password");
};

const getAllCoachPlayers = async (coachId) => {
  const teams = await Team.find({ coachId }).select("_id");
  const teamIds = teams.map((t) => t._id);
  const players = await User.find({ role: "player", teamId: { $in: teamIds } })
    .select("-password")
    .lean();

  if (players.length === 0) return players;

  const since = addDays(startOfDay(new Date()), -30);
  const reports = await Report.find({
    playerId: { $in: players.map((p) => p._id) },
    date: { $gte: since },
  }).populate("eventId", "date");

  const latestByPlayer = new Map();
  reports.forEach((r) => {
    const id = String(r.playerId);
    const prev = latestByPlayer.get(id);
    if (!prev || metrics.reportDate(r) > metrics.reportDate(prev)) {
      latestByPlayer.set(id, r);
    }
  });

  return players.map((p) => {
    const latest = latestByPlayer.get(String(p._id));
    return {
      ...p,
      metrics: {
        trainingLoad: latest ? (latest.trainingLoad ?? null) : null,
        fatigue: latest ? (latest.wellness?.fatigue ?? null) : null,
        stress: latest ? (latest.wellness?.stress ?? null) : null,
      },
    };
  });
};

module.exports = {
  assertCoachOwnsTeam,
  createTeam,
  getCoachTeams,
  getTeamById,
  updateTeam,
  joinTeam,
  removePlayer,
  getTeamPlayers,
  getAllCoachPlayers,
};
