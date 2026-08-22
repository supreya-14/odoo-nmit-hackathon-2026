const Performance = require('../models/Performance');
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const Leave = require('../models/Leave');
const { calculatePerformanceScore } = require('../services/performanceService');
const { generateAIInsights } = require('../services/aiService');

// @desc Get my own performance (auto-calculated live + latest saved record)
// @route GET /api/performance/my
const getMyPerformance = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

  const scores = await calculatePerformanceScore(employee._id);
  const latestRecord = await Performance.findOne({ employeeId: employee._id }).sort({
    createdAt: -1,
  });

  res.json({ ...scores, managerFeedback: latestRecord?.managerFeedback || '', aiInsights: latestRecord?.aiInsights || null });
};

// @desc Get a specific employee's performance (Admin/HR only)
// @route GET /api/performance/:employeeId
const getEmployeePerformance = async (req, res) => {
  const employee = await Employee.findById(req.params.employeeId);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });

  const scores = await calculatePerformanceScore(employee._id);
  const records = await Performance.find({ employeeId: employee._id }).sort({ createdAt: -1 });

  res.json({ ...scores, history: records });
};

// @desc Save/create a performance record with manager feedback (Admin/HR only)
// @route POST /api/performance
const createPerformanceRecord = async (req, res) => {
  const { employeeId, managerFeedback, strengths, weaknesses, suggestions } = req.body;

  if (!employeeId) {
    return res.status(400).json({ message: 'employeeId is required' });
  }

  const scores = await calculatePerformanceScore(employeeId);

  const record = await Performance.create({
    employeeId,
    ...scores,
    managerFeedback,
    strengths: strengths || [],
    weaknesses: weaknesses || [],
    suggestions: suggestions || [],
  });

  res.status(201).json(record);
};

// @desc Update a performance record (Admin/HR only)
// @route PUT /api/performance/:id
const updatePerformanceRecord = async (req, res) => {
  const record = await Performance.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Performance record not found' });

  const fields = ['managerFeedback', 'strengths', 'weaknesses', 'suggestions'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) record[f] = req.body[f];
  });

  await record.save();
  res.json(record);
};

// @desc Generate AI-powered performance insights via Gemini (Admin/HR only)
// @route POST /api/performance/:employeeId/ai-insights
const getAIInsights = async (req, res) => {
  const employee = await Employee.findById(req.params.employeeId);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });

  const scores = await calculatePerformanceScore(employee._id);
  const tasks = await Task.find({ assignedTo: employee._id });
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const overdueTasks = tasks.filter((t) => t.status === 'OVERDUE').length;
  const leaves = await Leave.find({ employeeId: employee._id, status: 'APPROVED' });

  const aiInsights = await generateAIInsights({
    ...scores,
    completedTasks,
    overdueTasks,
    leavesTaken: leaves.length,
  });

  // Save the insights onto the latest (or a new) performance record for this period
  let record = await Performance.findOne({
    employeeId: employee._id,
    reviewPeriod: new Date().toISOString().slice(0, 7),
  });

  if (!record) {
    record = await Performance.create({ employeeId: employee._id, ...scores });
  }

  record.aiInsights = aiInsights;
  await record.save();

  res.json(aiInsights);
};

module.exports = {
  getMyPerformance,
  getEmployeePerformance,
  createPerformanceRecord,
  updatePerformanceRecord,
  getAIInsights,
};
