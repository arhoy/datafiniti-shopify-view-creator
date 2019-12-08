const rateLimit = require('express-rate-limit');

// Rate limiting
exports.apiLimiter = rateLimit({
  windowsMs: 10 * 60 * 1000, // 10 mins
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many overall api requests. Please try again later',
});

// Rate limit the reset password route
exports.resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 30, // start blocking after 3 requests
  message: 'Too many password resets in time frame. Please try again later',
});

// Rate limit the number of accounts created
exports.accountRegister = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 100, // start blocking after 10 requests
  message: 'Too many accounts created during this time. Please try again later',
});
