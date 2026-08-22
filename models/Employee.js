const mongoose = require('mongoose');

// Salary is embedded inside employee, only ever sent to Admin/HR by controllers
const salarySchema = new mongoose.Schema(
  {
    wageType: { type: String, default: 'Monthly' },
    monthlyWage: { type: Number, default: 0 },
    yearlyWage: { type: Number, default: 0 },
    basicSalary: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    standardAllowance: { type: Number, default: 0 },
    performanceBonus: { type: Number, default: 0 },
    leaveTravelAllowance: { type: Number, default: 0 },
    fixedAllowance: { type: Number, default: 0 },
    providentFund: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    workingDays: { type: Number, default: 22 },
    breakTime: { type: String, default: '1 hour' },
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    company: { type: String, default: 'Dayflow Org' },
    department: { type: String, default: 'General' },
    jobPosition: { type: String, default: 'Employee' },
    manager: { type: String, default: '' },
    location: { type: String, default: '' },
    dateOfBirth: { type: Date },
    joiningDate: { type: Date, default: Date.now },
    address: { type: String, default: '' },
    nationality: { type: String, default: '' },
    gender: { type: String, default: '' },
    maritalStatus: { type: String, default: '' },
    skills: [{ type: String }],
    certifications: [{ type: String }],
    about: { type: String, default: '' },
    interests: [{ type: String }],
    resume: { type: String, default: '' },
    salary: { type: salarySchema, default: () => ({}) },
    leaveBalance: {
      paid: { type: Number, default: 12 },
      sick: { type: Number, default: 6 },
      unpaid: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
