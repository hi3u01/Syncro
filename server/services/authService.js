const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Team = require("../models/Team");
const ApiError = require("../utils/ApiError");

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const publicUser = (user) => {
  // teamId may be populated (a Team doc) or a raw ObjectId/null.
  const populated = user.teamId && user.teamId._id;
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    teamId: populated ? user.teamId._id : user.teamId,
    teamName: populated ? user.teamId.name : null,
    isActive: user.isActive,
  };
};

const register = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  joinCode,
}) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(400, "Uživatel s tímto e-mailem již existuje.");
  }

  let assignedTeamId = null;
  if (role === "player" && joinCode) {
    const team = await Team.findOne({ joinCode: joinCode.toUpperCase() });
    if (!team) {
      throw new ApiError(400, "Neplatný zvací kód týmu.");
    }
    assignedTeamId = team._id;
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role === "coach" ? "coach" : "player",
    teamId: assignedTeamId,
  });

  await user.populate("teamId", "name");
  return { ...publicUser(user), token: generateToken(user) };
};

const login = async ({ email, password }) => {
  if (typeof email !== "string" || typeof password !== "string") {
    throw new ApiError(401, "Neplatný email nebo heslo.");
  }
  const user = await User.findOne({ email }).populate("teamId", "name");
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Neplatný email nebo heslo.");
  }
  if (!user.isActive) {
    throw new ApiError(
      403,
      "Účet byl deaktivován. Kontaktujte administrátora.",
    );
  }
  return { ...publicUser(user), token: generateToken(user) };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).populate("teamId", "name");
  if (!user) {
    throw new ApiError(404, "Uživatel nenalezen.");
  }
  return publicUser(user);
};

module.exports = { register, login, generateToken, publicUser, getProfile };
