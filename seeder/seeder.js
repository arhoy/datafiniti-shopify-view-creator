/*** WARNING THIS WILL DESTROY ALL THE DATA IN THE DATABASES Listed BELOW ***/
// import and delete all files below from associated models
// make sure in seeder folder and run
// for import node seeder -i
// for delete node seeder -d
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: '../config/config.env' });

const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const User = require('../models/User');
const Review = require('../models/BootcampCourseReview');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

console.log('This is the dirname', path.join(__dirname, '../_data'));
// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../_data/bootcamp.json'), 'utf-8'),
);

const courses = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../_data/courses.json'), 'utf-8'),
);

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../_data/users.json'), 'utf-8'),
);

const reviews = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../_data/bootcampCourseReview.json'),
    'utf-8',
  ),
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
