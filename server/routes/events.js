const express = require("express");
const router = express.Router();
const { protect, coachOnly } = require("../middleware/auth");
const {
  createEvent,
  getTeamEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.post("/", protect, coachOnly, createEvent);
router.get("/team/:teamId", protect, getTeamEvents);
router.put("/:id", protect, coachOnly, updateEvent);
router.delete("/:id", protect, coachOnly, deleteEvent);

module.exports = router;
