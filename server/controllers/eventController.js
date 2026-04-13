const Event = require("../models/Event");
const Team = require("../models/Team");

//POST /events - create new event
const createEvent = async (req, res) => {
  try {
    const { teamId, date, type, title, plannedDuration } = req.body;

    const team = await Team.findOne({ _id: teamId, coachId: req.user._id });
    if (!team) {
      return res
        .status(403)
        .json({ error: "You do not have access to this team." });
    }

    const newEvent = await Event.create({
      teamId,
      date,
      type,
      title,
      plannedDuration,
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /events/team/:teamId - get all events for a team
const getTeamEvents = async (req, res) => {
  try {
    const { teamId } = req.params;

    const events = await Event.find({ teamId }).sort({ date: -1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /events/:id - update event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });

    const team = await Team.findOne({
      _id: event.teamId,
      coachId: req.user._id,
    });
    if (!team)
      return res
        .status(403)
        .json({ error: "You are not allowed to edit this event" });

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /events/:id - delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });

    const team = await Team.findOne({
      _id: event.teamId,
      coachId: req.user._id,
    });
    if (!team)
      return res
        .status(403)
        .json({ error: "You are not allowed to edit this event" });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createEvent,
  getTeamEvents,
  updateEvent,
  deleteEvent,
};
