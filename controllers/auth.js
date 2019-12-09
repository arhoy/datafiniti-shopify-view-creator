const crypto = require('crypto');

const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    // eslint-disable-next-line no-undef
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 86400),
    httpOnly: true,
  };

  // set secure cookie for production
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  // send back response code with cookie
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// type :           POST
// route:           api/v1/auth/register
// desc:            Register a user
// access:          Public, anyone can register
// return value:    token
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  sendTokenResponse(user, 200, res);
});

// type :           POST
// route:           api/v1/auth/login
// desc:            Login a user
// access:          Public, anyone can login
// return value:    token
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(
      new ErrorResponse('This password/email combo was incorrect', 401),
    );
  }
  // check if the password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(
      new ErrorResponse('This password/email combo was incorrect', 401),
    );
  }
  sendTokenResponse(user, 200, res);
});

// type :           GET
// route:           api/v1/auth/me
// desc:            Return current user
// access:          Private
// return value:    user object minus password
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(
      new ErrorResponse(
        'Cannot get authentication information, please login or contact support',
        401,
      ),
    );
  }

  return res.status(200).json({ success: true, data: user });
});

// type :           GET
// route:           api/v1/auth/logout
// desc:            Log current user out
// access:          Private
// return value:    user object minus password
exports.logout = asyncHandler(async (req, res) => {
  // we have access to cookie via cookie parser
  res.clearCookie('token');

  return res.status(200).json({ success: true, data: {} });
});

// type :           POST
// route:           api/v1/auth/forgotpassword
// desc:            Route to send reset token to email
// access:          Public, anyone can request password request
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // check if user
  if (!user) {
    return next(new ErrorResponse('Cannot find user with that email', 200));
  }

  const resetToken = await user.getResetPasswordToken();

  // save results to database
  await user.save({ validateBeforeSave: false });

  // create reset URL
  const resetUrl = `${process.env.FRONT_END_URL_PRODUCTION}/resetpassword/?${resetToken}`;

  const message = `Did you request a password reset? If so please click on the link below to reset your password If not you can safely ignore this email \n\n ${resetUrl}`;

  const html = `<p>
  Did you request a password reset? If so please click on the link below to reset your password If not you can safely ignore this email <br/><br/> <a href = ${resetUrl} > Reset Here</a> 
  </p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message,
      html,
    });

    return res.status(200).json({
      success: true,
      data: 'A password reset link has been sent to your email',
    });
  } catch (error) {
    // if not able to send email, then
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(new ErrorResponse('Was not able to send email', 500));
  }
});
// type :           PUT
// route:           api/v1/auth/resetpassword/:resettoken
// desc:            Route to handle forgetting password
// access:          Private, must have the token and link
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get hashed token

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.body.token)
    .digest('hex');

  // get user but only if token is not expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token or token has expired!', 400));
  }
  // set new password ( encrypts via presave hook )
  user.password = req.body.password;
  // reset the resetTokens
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  // save the user
  await user.save();

  return res.status(200).json({
    success: true,
    data: 'Password Reset Success',
  });
});

// type :           PUT
// route:           api/v1/auth/updatedetails
// desc:            Route update the user details (no password)
// access:          Private, only user can update his/her details
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ success: true, data: user });
});

// type :           PUT
// route:           api/v1/auth/updatepassword
// desc:            Route update my password (on UI, NOT forgot password)
// access:          Private, only user can update his/her password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new ErrorResponse('User not found', 401));
  }

  // check user knows current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is not correct', 401));
  }

  // set new password
  user.password = req.body.newPassword;
  await user.save();

  // send back token response
  sendTokenResponse(user, 200, res);
});

/** ADMIN CRUD OPERATIONS **/

// type :           GET
// route:           api/v1/auth/admin/users
// desc:            See all users in the db
// access:          ADMIN ONLY
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // get all users

  res.status(200).json(res.advancedResults);
});

// type :           GET
// route:           api/v1/auth/admin/users/:id
// desc:            Get specific user
// access:          ADMIN ONLY
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// type :           POST
// route:           api/v1/auth/admin/users
// desc:            Create specific user
// access:          ADMIN ONLY
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// type :           PUT
// route:           api/v1/auth/admin/users/:id
// desc:            Update specific user
// access:          ADMIN ONLY
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// type :           DELETE
// route:           api/v1/auth/admin/users/:id
// desc:            Delete specific user
// access:          ADMIN ONLY
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
