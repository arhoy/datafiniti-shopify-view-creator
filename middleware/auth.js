const jwt = require('jsonwebtoken');
const asynHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User with role of ${req.user.role} not allowed to access route`,
          403,
        ),
      );
    }
    next();
  };
};

// Protect the routes
exports.protect = asynHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    // attach token to cookies. See auth controller send response token
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('You do not have access to this route', 401));
  }

  try {
    // verify token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get the decoded id
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('You do not have access to this route', 401));
  }
  // checking cookies
});
