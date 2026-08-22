const User = require('../models/User');

// Builds an employee ID like OT-JODO-2023-0001
// OT -> first two letters of company name
// JODO -> first two letters of first name + first two letters of last name
// 2023 -> joining year
// 0001 -> serial number (auto incremented per year)
const generateEmployeeId = async (companyName, firstName, lastName, joiningDate) => {
  const companyCode = companyName.replace(/\s+/g, '').substring(0, 2).toUpperCase();
  const namePart =
    firstName.substring(0, 2).toUpperCase() + lastName.substring(0, 2).toUpperCase();
  const year = new Date(joiningDate || Date.now()).getFullYear();

  // Count how many users already have an ID from this same year to get next serial number
  const prefix = `${companyCode}-${namePart}-${year}-`;
  const countThisYear = await User.countDocuments({
    employeeId: { $regex: `^${companyCode}-.*-${year}-` },
  });

  const serial = String(countThisYear + 1).padStart(4, '0');

  return `${prefix}${serial}`;
};

module.exports = generateEmployeeId;
