const asyncHandler = require("../middleware/asyncHandler");
const reportService = require("../services/reportService");

const createReport = asyncHandler(async (req, res) => {
  const report = await reportService.createReport(req.user, req.body);
  res.status(201).json(report);
});

const getMyReports = asyncHandler(async (req, res) => {
  res.json(await reportService.getPlayerReports(req.user._id));
});

const getReport = asyncHandler(async (req, res) => {
  res.json(await reportService.getReportById(req.params.id, req.user));
});

const deleteReport = asyncHandler(async (req, res) => {
  res.json(await reportService.deleteReport(req.params.id, req.user._id));
});

module.exports = {
  createReport,
  getMyReports,
  getReport,
  deleteReport,
};
