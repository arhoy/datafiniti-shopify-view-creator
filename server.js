/* eslint-disable no-undef */
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

require('colors');
const fileupload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// security
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const errorHandler = require('./middleware/errorHandler');

// load environmental variables
dotenv.config({ path: './config/config.env' });

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

// Prevent http param pollution
app.use(hpp());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// use Routes!

// Default Get Products
app.use('/api/v1/datafiniti', require('./routes/api/datafiniti'));

// Get Canada Products
app.use('/api/v1/datafinitiCanada', require('./routes/api/datafinitiCanada'));

// Get Realty Data from Datafinity
app.use('/api/v1/datafinitiRealty', require('./routes/api/datafinitiRealty'));

// middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('server has started'.green.bold));
