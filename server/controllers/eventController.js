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

// GET /events/player/recent - get recent events for logged in player
const getPlayerRecentEvents = async (req, res) => {
  try {
    const teamId = req.user.teamId;

    if (!teamId) {
      return res.status(400).json({ error: "Nejsi přiřazen k žádnému týmu." });
    }

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const events = await Event.find({
      teamId: teamId,
      date: { $lte: endOfToday }, // only from today and earlier
    })
      .sort({ date: -1 })
      .limit(10);

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
  getPlayerRecentEvents,
  updateEvent,
  deleteEvent,
};
