const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Nepřihlášený přístup, chybí token." });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ error: "Uživatel k tokenu už neexistuje." });
    }
    if (!user.isActive) {
      return res.status(403).json({ error: "Účet byl deaktivován." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Nepřihlášený přístup, neplatný token." });
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res
      .status(403)
      .json({ error: "Přístup zamítnut. Nedostatečná oprávnění." });
  };

const coachOnly = authorize("coach");
const adminOnly = authorize("admin");

module.exports = { protect, authorize, coachOnly, adminOnly };
