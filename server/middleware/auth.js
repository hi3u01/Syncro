const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("Token validation error:", error.message);
      res.status(401).json({ error: "Unauthorized access, invalid token" });
    }
  }
  if (!token) {
    res.status(401).json({ error: "Unauthorized access, missing token" });
  }
};

const coachOnly = (req, res, next) => {
  if (req.user && req.user.role === "coach") {
    next();
  } else {
    res.status(403).json({
      error: "Access denied. Only the coach can perform this action.",
    });
  }
};

module.exports = { protect, coachOnly };
