const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

// load environmental variables
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

// init express
const app = express();

// configure cors
app.use(cors());

// Init the middleware to get req.body for form fields
app.use(express.json({ extended: true }));

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// use Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/reviews', require('./routes/api/reviews'));

app.use('/api/v1/bootcamps', require('./routes/api/bootcamps'));
app.use('/api/v1/courses', require('./routes/api/courses'));

// middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('server has started'.yellow.bold));
