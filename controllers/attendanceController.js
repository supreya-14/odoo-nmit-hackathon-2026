const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { calculateWorkHours, determineStatus } = require('../services/attendanceService');

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc Check in for today
// @route POST /api/attendance/check-in
const checkIn = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

  const today = startOfDay(new Date());

  let record = await Attendance.findOne({ employeeId: employee._id, date: today });
  if (record && record.checkIn) {
    return res.status(400).json({ message: 'You have already checked in today' });
  }

  const now = new Date();
  const status = determineStatus(now);

  if (record) {
    record.checkIn = now;
    record.status = status;
  } else {
    record = await Attendance.create({
      employeeId: employee._id,
      date: today,
      checkIn: now,
      status,
    });
  }

  await record.save();
  res.json(record);
};

// @desc Check out for today
// @route POST /api/attendance/check-out
const checkOut = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

  const today = startOfDay(new Date());
  const record = await Attendance.findOne({ employeeId: employee._id, date: today });

  if (!record || !record.checkIn) {
    return res.status(400).json({ message: 'You must check in before checking out' });
  }
  if (record.checkOut) {
    return res.status(400).json({ message: 'You have already checked out today' });
  }

  const now = new Date();
  const { workHours, extraHours } = calculateWorkHours(record.checkIn, now);

  record.checkOut = now;
  record.workHours = workHours;
  record.extraHours = extraHours;

  await record.save();
  res.json(record);
};

// @desc Get my attendance history
// @route GET /api/attendance/my
const getMyAttendance = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  const records = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 });
  res.json(records);
};

// @desc Get all employees' attendance (Admin/HR only)
// @route GET /api/attendance/all
const getAllAttendance = async (req, res) => {
  const records = await Attendance.find()
    .populate('employeeId', 'firstName lastName employeeId department profileImage')
    .sort({ date: -1 });
  res.json(records);
};

module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance };
