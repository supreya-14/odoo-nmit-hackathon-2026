const Employee = require('../models/Employee');
const User = require('../models/User');
const generateEmployeeId = require('../utils/generateEmployeeId');

// Removes salary block unless requester is ADMIN/HR or viewing their own record
const sanitizeEmployee = (employee, requester) => {
  const obj = employee.toObject();
  const isOwner = obj.userId?.toString() === requester._id.toString();
  const isAdmin = requester.role === 'ADMIN' || requester.role === 'HR';

  if (!isAdmin && !isOwner) {
    delete obj.salary;
  }
  // Even the owner (a plain employee) should not see their own salary editing controls,
  // but per spec Salary Info tab is Admin/HR only regardless of ownership.
  if (!isAdmin) {
    delete obj.salary;
  }
  return obj;
};

// @desc Get all employees (Admin/HR only)
// @route GET /api/employees
const getEmployees = async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  const sanitized = employees.map((e) => sanitizeEmployee(e, req.user));
  res.json(sanitized);
};

// @desc Get single employee by id
// @route GET /api/employees/:id
const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(sanitizeEmployee(employee, req.user));
};

// @desc Create new employee (Admin/HR only) - creates User + Employee, generates temp password
// @route POST /api/employees
const createEmployee = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    jobPosition,
    manager,
    location,
    company,
    joiningDate,
  } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: 'First name, last name and email are required' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: 'An account with this email already exists' });
  }

  const companyName = company || 'Dayflow Org';
  const employeeId = await generateEmployeeId(companyName, firstName, lastName, joiningDate);

  // Temporary password - shown once to Admin so they can share it with the employee
  const tempPassword = `Dayflow@${Math.floor(1000 + Math.random() * 9000)}`;

  const user = await User.create({
    employeeId,
    email: email.toLowerCase(),
    password: tempPassword,
    role: 'EMPLOYEE',
    isFirstLogin: true,
  });

  const employee = await Employee.create({
    userId: user._id,
    employeeId,
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone,
    company: companyName,
    department,
    jobPosition,
    manager,
    location,
    joiningDate: joiningDate || Date.now(),
  });

  res.status(201).json({
    employee,
    credentials: {
      employeeId,
      temporaryPassword: tempPassword,
    },
  });
};

// @desc Update employee profile
// @route PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'HR';
  const isOwner = employee.userId.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: 'Not authorized to update this profile' });
  }

  // Restrict which fields a plain employee can edit about themselves
  const allowedForEmployee = [
    'phone',
    'profileImage',
    'address',
    'about',
    'skills',
    'certifications',
    'interests',
    'resume',
  ];

  const allowedForAdmin = [
    ...allowedForEmployee,
    'firstName',
    'lastName',
    'department',
    'jobPosition',
    'manager',
    'location',
    'dateOfBirth',
    'nationality',
    'gender',
    'maritalStatus',
    'salary',
  ];

  const fieldsToUpdate = isAdmin ? allowedForAdmin : allowedForEmployee;

  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) {
      employee[field] = req.body[field];
    }
  });

  await employee.save();
  res.json(sanitizeEmployee(employee, req.user));
};

// @desc Delete/deactivate an employee (Admin/HR only)
// @route DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  await User.findByIdAndUpdate(employee.userId, { isActive: false });
  await Employee.findByIdAndDelete(req.params.id);

  res.json({ message: 'Employee removed successfully' });
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
