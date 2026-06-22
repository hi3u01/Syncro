const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Team = require("../models/Team");
const ApiError = require("../utils/ApiError");

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

const publicUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  teamId: user.teamId,
  isActive: user.isActive,
});

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

  return { ...publicUser(user), token: generateToken(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
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

module.exports = { register, login, generateToken, publicUser };
