// DB Config

const express = require('express');

const connectDB = require('./config/db');

const app = express();

const cors = require('cors');

// configure cors
app.use(cors())

// Connect to Database
connectDB();

// Init the middleware to get req.body for form fields
app.use(express.json({ extended: true }));

// use Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('server has started'));
