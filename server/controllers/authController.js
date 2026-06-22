const asyncHandler = require("../middleware/asyncHandler");
const authService = require("../services/authService");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

// TODO: Implement forgotPassword and resetPassword functionality
const forgotPassword = asyncHandler(async (req, res) => {
  res.status(501).json({ error: "Reset hesla zatím není implementován." });
});

const resetPassword = asyncHandler(async (req, res) => {
  res.status(501).json({ error: "Reset hesla zatím není implementován." });
});

module.exports = { register, login, forgotPassword, resetPassword };
