const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// @desc Apply for leave
// @route POST /api/leaves
const applyLeave = async (req, res) => {
  const { leaveType, startDate, endDate, reason, attachment } = req.body;

  if (!leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'Please fill in all required leave fields' });
  }

  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) {
    return res.status(400).json({ message: 'End date cannot be before start date' });
  }

  const numberOfDays = Math.round((end - start) / MS_PER_DAY) + 1;

  const leave = await Leave.create({
    employeeId: employee._id,
    leaveType,
    startDate: start,
    endDate: end,
    numberOfDays,
    reason,
    attachment: attachment || '',
  });

  res.status(201).json(leave);
};

// @desc Get my leave history + balance
// @route GET /api/leaves/my
const getMyLeaves = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  const leaves = await Leave.find({ employeeId: employee._id }).sort({ createdAt: -1 });
  res.json({ leaves, leaveBalance: employee.leaveBalance });
};

// @desc Get all leave requests (Admin/HR only)
// @route GET /api/leaves/all
const getAllLeaves = async (req, res) => {
  const leaves = await Leave.find()
    .populate('employeeId', 'firstName lastName employeeId department profileImage')
    .sort({ createdAt: -1 });
  res.json(leaves);
};

// @desc Approve leave (Admin/HR only)
// @route PUT /api/leaves/:id/approve
const approveLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });
  if (leave.status !== 'PENDING') {
    return res.status(400).json({ message: 'This leave request has already been processed' });
  }

  const approver = await Employee.findOne({ userId: req.user._id });

  leave.status = 'APPROVED';
  leave.approvedBy = approver?._id;
  leave.approvedAt = new Date();
  await leave.save();

  // Deduct from leave balance
  const employee = await Employee.findById(leave.employeeId);
  if (employee) {
    if (leave.leaveType === 'PAID_TIME_OFF') {
      employee.leaveBalance.paid = Math.max(0, employee.leaveBalance.paid - leave.numberOfDays);
    } else if (leave.leaveType === 'SICK_LEAVE') {
      employee.leaveBalance.sick = Math.max(0, employee.leaveBalance.sick - leave.numberOfDays);
    } else {
      employee.leaveBalance.unpaid += leave.numberOfDays;
    }
    await employee.save();
  }

  res.json(leave);
};

// @desc Reject leave (Admin/HR only)
// @route PUT /api/leaves/:id/reject
const rejectLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });
  if (leave.status !== 'PENDING') {
    return res.status(400).json({ message: 'This leave request has already been processed' });
  }

  const approver = await Employee.findOne({ userId: req.user._id });

  leave.status = 'REJECTED';
  leave.approvedBy = approver?._id;
  leave.approvedAt = new Date();
  leave.rejectionReason = req.body.rejectionReason || 'Not specified';
  await leave.save();

  res.json(leave);
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, approveLeave, rejectLeave };
