const Event = require("../models/Event");
const Report = require("../models/Report");
const ApiError = require("../utils/ApiError");
const { assertCoachOwnsTeam } = require("./teamService");
const { endOfDay } = require("../utils/dates");

// Resolve an event and confirm the coach owns its team
const assertCoachOwnsEvent = async (eventId, coachId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Událost nebyla nalezena.");
  await assertCoachOwnsTeam(event.teamId, coachId);
  return event;
};

const createEvent = async (coachId, data) => {
  const {
    teamId,
    date,
    type,
    title,
    plannedDuration,
    plannedRpe,
    description,
  } = data;
  await assertCoachOwnsTeam(teamId, coachId);
  return Event.create({
    teamId,
    createdBy: coachId,
    date,
    type,
    title,
    plannedDuration,
    plannedRpe,
    description,
  });
};

const getTeamEvents = async (teamId, coachId) => {
  await assertCoachOwnsTeam(teamId, coachId);
  return Event.find({ teamId }).sort({ date: -1 });
};

const getEventsForUser = async (user, query) => {
  if (user.role === "coach") {
    if (!query.teamId) throw new ApiError(400, "Chybí parametr teamId.");
    return getTeamEvents(query.teamId, user._id);
  }
  if (!user.teamId) throw new ApiError(400, "Nejsi přiřazen k žádnému týmu.");

  if (query.scope === "recent") {
    return Event.find({
      teamId: user.teamId,
      date: { $lte: endOfDay(new Date()) },
    })
      .sort({ date: -1 })
      .limit(10);
  }
  return Event.find({ teamId: user.teamId }).sort({ date: -1 });
};

const updateEvent = async (eventId, coachId, data) => {
  await assertCoachOwnsEvent(eventId, coachId);
  return Event.findByIdAndUpdate(eventId, data, {
    new: true,
    runValidators: true,
  });
};

const deleteEvent = async (eventId, coachId) => {
  await assertCoachOwnsEvent(eventId, coachId);
  await Event.findByIdAndDelete(eventId);
  return { message: "Událost byla smazána." };
};

const getEventReports = async (eventId, coachId) => {
  await assertCoachOwnsEvent(eventId, coachId);
  return Report.find({ eventId }).populate("playerId", "firstName lastName");
};

module.exports = {
  assertCoachOwnsEvent,
  createEvent,
  getTeamEvents,
  getEventsForUser,
  updateEvent,
  deleteEvent,
  getEventReports,
};
