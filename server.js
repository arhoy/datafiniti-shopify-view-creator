/* eslint-disable no-undef */
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const fileupload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// security
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

// rate limiting
const {
  apiLimiter,
  resetPasswordLimiter,
  accountRegister,
} = require('./middleware/rateLimiting');

// load environmental variables
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

// init express
const app = express();

// configure cors
app.use(cors());

// cookies
app.use(cookieParser());

// Init the middleware to get req.body for form fields
app.use(express.json({ extended: true }));

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// file uploading
app.use(fileupload());

// init security headers / sanitize data / xss attack
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// limit api requests to those above
app.use('/api', apiLimiter);
app.use('/api/v1/auth/resetpassword/', resetPasswordLimiter);
app.use('/api/v1/auth/register', accountRegister);

// Prevent http param pollution
app.use(hpp());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// use Routes!
// authentication
app.use('/api/v1/auth', require('./routes/api/auth'));

// admin routes
app.use('/api/v1/auth/users', require('./routes/api/users'));

// user profiles
app.use('/api/v1/profile', require('./routes/api/profile'));

// bootcamps
app.use('/api/v1/bootcamps', require('./routes/api/bootcamps'));

// bootcamp courses
app.use('/api/v1/courses', require('./routes/api/courses'));

// bootcamp course reviews
app.use(
  '/api/v1/bootcampcoursereview',
  require('./routes/api/bootcampCourseReview'),
);

// relates to product slug reviews
app.use('/api/v1/reviews', require('./routes/api/reviews'));

// middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('server has started'.yellow.bold));
