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

// module.exports = function(req, res, next) {
//   // Get token from header
//   const token = req.header('x-auth-token');

//   // Check if not token
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   // Verify tokens
//   try {
//     const decoded = jwt.verify(token, config.get('jwtSecret'));

//     req.user = decoded.user;

//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };
