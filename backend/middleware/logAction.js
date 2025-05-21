const Log = require('../models/Log');

module.exports = function(action) {
  return async (req, res, next) => {
    try {
      await Log.create({ user: req.user.id, action });
    } catch (err) {
      // Logging should not block the main action
      console.error('Log error:', err.message);
    }
    next();
  };
};
