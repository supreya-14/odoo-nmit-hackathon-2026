const Task = require('../models/Task');
const Employee = require('../models/Employee');

// @desc Get tasks - Admin sees all, employee sees only their own
// @route GET /api/tasks
const getTasks = async (req, res) => {
  const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'HR';
  let query = {};

  if (!isAdmin) {
    const employee = await Employee.findOne({ userId: req.user._id });
    query = { assignedTo: employee._id };
  }

  const tasks = await Task.find(query)
    .populate('assignedTo', 'firstName lastName employeeId profileImage')
    .populate('createdBy', 'firstName lastName employeeId')
    .sort({ createdAt: -1 });

  res.json(tasks);
};

// @desc Get single task
// @route GET /api/tasks/:id
const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'firstName lastName employeeId profileImage userId')
    .populate('createdBy', 'firstName lastName employeeId');

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'HR';
  const isOwner = task.assignedTo.userId?.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: 'Not authorized to view this task' });
  }

  res.json(task);
};

// @desc Create/assign a new task (Admin/HR only)
// @route POST /api/tasks
const createTask = async (req, res) => {
  const { title, description, assignedTo, priority, status, startDate, dueDate } = req.body;

  if (!title || !assignedTo || !dueDate) {
    return res.status(400).json({ message: 'Title, assigned employee and due date are required' });
  }

  const creatorEmployee = await Employee.findOne({ userId: req.user._id });

  const task = await Task.create({
    title,
    description,
    assignedTo,
    createdBy: creatorEmployee?._id,
    priority: priority || 'MEDIUM',
    status: status || 'TODO',
    startDate: startDate || Date.now(),
    dueDate,
  });

  res.status(201).json(task);
};

// @desc Update task (status/progress by employee, full edit by Admin/HR)
// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id).populate('assignedTo', 'userId');
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'HR';
  const isOwner = task.assignedTo.userId?.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: 'Not authorized to update this task' });
  }

  const allowedForEmployee = ['status', 'progress'];
  const allowedForAdmin = [
    'title',
    'description',
    'assignedTo',
    'priority',
    'status',
    'dueDate',
    'progress',
  ];

  const fields = isAdmin ? allowedForAdmin : allowedForEmployee;
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  if (req.body.comment) {
    const employee = await Employee.findOne({ userId: req.user._id });
    task.comments.push({
      author: employee?._id,
      authorName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
      text: req.body.comment,
    });
  }

  if (task.status === 'COMPLETED' && !task.completionDate) {
    task.completionDate = new Date();
    task.progress = 100;
  }

  await task.save();
  res.json(task);
};

// @desc Delete task (Admin/HR only)
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted successfully' });
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
