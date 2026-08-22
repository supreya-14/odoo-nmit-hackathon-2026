const jwt = require('jsonwebtoken');

// Creates a signed JWT that stores the user's id and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
