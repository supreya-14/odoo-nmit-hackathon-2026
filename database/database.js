const mongoose = require('mongoose');

// Returns simple connection status info, used for health checks if needed
const getConnectionStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = { getConnectionStatus };
