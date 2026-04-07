const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Team = require("../models/Team");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// POST /users/register - register new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, joinCode } = req.body;

    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ error: "Uživatel s tímto e-mailem již existuje." });
    }

    let assignedTeamId = null;

    // if player and provided a join code
    if (role === "player" && joinCode) {
      const team = await Team.findOne({ joinCode });
      if (!team) {
        return res.status(400).json({ error: "Invalid team invite code." });
      }
      assignedTeamId = team._id;
    }

    // create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      teamId: assignedTeamId,
    });

    // return data and token
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /users/login - login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: "Neplatný email nebo heslo." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
