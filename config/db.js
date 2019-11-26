const mongoose = require('mongoose');

const config = require('config');

// get databse connection string
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Mongo db connected'.underline.brightGreen.bold);
  } catch (error) {
    console.error('There was an error', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
