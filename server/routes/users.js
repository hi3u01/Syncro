const express = require("express");
const router = express.Router();
const { protect, authorize, coachOnly, adminOnly } = require("../middleware/auth");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserReports,
  getUserAnalytics,
} = require("../controllers/userController");

router.get("/", protect, authorize("admin", "coach"), getUsers);
router.get("/:id/reports", protect, coachOnly, getUserReports);
router.get("/:id/analytics", protect, coachOnly, getUserAnalytics);
router.get("/:id", protect, authorize("admin", "coach"), getUser);
router.patch("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
