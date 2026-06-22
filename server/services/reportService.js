const Report = require("../models/Report");
const Event = require("../models/Event");
const Team = require("../models/Team");
const ApiError = require("../utils/ApiError");
const metrics = require("./metricsService");
const { RPE, REST_EVENT_TYPES } = require("../constants/validation");

const createReport = async (user, { eventId, rpe, wellness, note }) => {
  if (!eventId) throw new ApiError(400, "Chybí událost (eventId).");

  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Událost nebyla nalezena.");

  // The player can only report on events of their own team
  if (!user.teamId || String(event.teamId) !== String(user.teamId)) {
    throw new ApiError(403, "K této události nemáš přístup.");
  }

  // Rest / regeneration days TL = 0.
  const isRestDay = REST_EVENT_TYPES.includes(event.type);
  const effectiveRpe = isRestDay ? 0 : Number(rpe);

  if (!isRestDay && (effectiveRpe < RPE.MIN || effectiveRpe > RPE.MAX)) {
    throw new ApiError(400, `RPE musí být v rozsahu ${RPE.MIN}–${RPE.MAX}.`);
  }

  const trainingLoad = isRestDay
    ? 0
    : metrics.computeTrainingLoad(effectiveRpe, event.plannedDuration);

  try {
    const report = await Report.create({
      playerId: user._id,
      eventId: event._id,
      teamId: event.teamId,
      rpe: effectiveRpe,
      trainingLoad,
      wellness,
      note,
    });
    return report;
  } catch (err) {
    // Unique index (playerId + eventId) => already submitted.
    if (err.code === 11000) {
      throw new ApiError(409, "Pro tuto událost jsi dotazník už odeslal.");
    }
    throw err;
  }
};

const getPlayerReports = (playerId) =>
  Report.find({ playerId })
    .sort({ date: -1 })
    .populate("eventId", "type title date plannedDuration");

const getReportById = async (id, user) => {
  const report = await Report.findById(id)
    .populate("eventId", "type title date plannedDuration")
    .populate("playerId", "firstName lastName");
  if (!report) throw new ApiError(404, "Report nebyl nalezen.");

  if (user.role === "player") {
    if (String(report.playerId._id) !== String(user._id)) {
      throw new ApiError(403, "K tomuto reportu nemáš přístup.");
    }
  } else if (user.role === "coach") {
    const owns = await Team.exists({ _id: report.teamId, coachId: user._id });
    if (!owns) throw new ApiError(403, "K tomuto reportu nemáte přístup.");
  }
  return report;
};

const deleteReport = async (id, coachId) => {
  const report = await Report.findById(id);
  if (!report) throw new ApiError(404, "Report nebyl nalezen.");
  const owns = await Team.exists({ _id: report.teamId, coachId });
  if (!owns) throw new ApiError(403, "K tomuto reportu nemáte přístup.");
  await Report.findByIdAndDelete(id);
  return { message: "Report byl smazán." };
};

module.exports = {
  createReport,
  getPlayerReports,
  getReportById,
  deleteReport,
};
