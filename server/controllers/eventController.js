const asyncHandler = require("../middleware/asyncHandler");
const eventService = require("../services/eventService");

const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.user._id, req.body);
  res.status(201).json(event);
});

const getEvents = asyncHandler(async (req, res) => {
  res.json(await eventService.getEventsForUser(req.user, req.query));
});

const updateEvent = asyncHandler(async (req, res) => {
  res.json(
    await eventService.updateEvent(req.params.id, req.user._id, req.body),
  );
});

const deleteEvent = asyncHandler(async (req, res) => {
  res.json(await eventService.deleteEvent(req.params.id, req.user._id));
});

const getEventReports = asyncHandler(async (req, res) => {
  res.json(await eventService.getEventReports(req.params.id, req.user._id));
});

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventReports,
};
