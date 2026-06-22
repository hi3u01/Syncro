const express = require("express");
const router = express.Router();
const { protect, coachOnly } = require("../middleware/auth");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventReports,
} = require("../controllers/eventController");

router.post("/", protect, coachOnly, createEvent);
router.get("/", protect, getEvents);
router.get("/:id/reports", protect, coachOnly, getEventReports);
router.patch("/:id", protect, coachOnly, updateEvent);
router.delete("/:id", protect, coachOnly, deleteEvent);

module.exports = router;
