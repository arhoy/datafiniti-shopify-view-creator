const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = {};

  if (err.name === 'CastError') {
    // define message and status code to pass in our custom ErrorResponse object ( an object which contains a message and status code )
    const message = `Resource not found with id of ${err.value}`;
    const statusCode = 404;

    // just an object with message and status code props
    error = new ErrorResponse(message, statusCode);
  }

  if (err.code === 11000) {
    const message = `Duplicate field entered`;
    const statusCode = 400;
    error = new ErrorResponse(message, statusCode);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: error.message || err.message || 'Server Error',
  });
};

module.exports = errorHandler;
