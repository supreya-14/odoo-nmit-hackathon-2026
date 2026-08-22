const User = require('../models/User');
const Employee = require('../models/Employee');
const generateToken = require('../utils/generateToken');
const generateEmployeeId = require('../utils/generateEmployeeId');

// @desc Register a new company/admin account (self-signup) or first user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  const { companyName, firstName, lastName, email, phone, password, confirmPassword } = req.body;

  if (!companyName || !firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const joiningDate = new Date();
  const employeeId = await generateEmployeeId(companyName, firstName, lastName, joiningDate);

  // First user to register for a company becomes ADMIN
  const user = await User.create({
    employeeId,
    email: email.toLowerCase(),
    password,
    role: 'ADMIN',
    isFirstLogin: false,
  });

  const employee = await Employee.create({
    userId: user._id,
    employeeId,
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone,
    company: companyName,
    department: 'Management',
    jobPosition: 'Administrator',
    joiningDate,
  });

  res.status(201).json({
    _id: user._id,
    employeeId: user.employeeId,
    email: user.email,
    role: user.role,
    name: `${employee.firstName} ${employee.lastName}`,
    token: generateToken(user._id, user.role),
  });
};

// @desc Login with email or employeeId + password
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({ message: 'Please provide login ID and password' });
  }

  const user = await User.findOne({
    $or: [{ email: loginId.toLowerCase() }, { employeeId: loginId }],
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(401).json({ message: 'Your account has been deactivated. Contact Admin/HR.' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const employee = await Employee.findOne({ userId: user._id });

  res.json({
    _id: user._id,
    employeeId: user.employeeId,
    email: user.email,
    role: user.role,
    isFirstLogin: user.isFirstLogin,
    name: employee ? `${employee.firstName} ${employee.lastName}` : '',
    profileImage: employee ? employee.profileImage : '',
    token: generateToken(user._id, user.role),
  });
};

// @desc Get logged in user's profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  res.json({
    _id: req.user._id,
    employeeId: req.user.employeeId,
    email: req.user.email,
    role: req.user.role,
    isFirstLogin: req.user.isFirstLogin,
    employee,
  });
};

// @desc Logout (client just clears the token; endpoint provided for completeness)
// @route POST /api/auth/logout
const logoutUser = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, getMe, logoutUser };
