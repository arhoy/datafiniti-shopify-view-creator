// This is the review model for the bootcamp courses.
const mongoose = require('mongoose');

const BootcampCourseReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bootcamp course review needs a title'],
    trim: true,
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'Bootcamp course review needs a text description'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Bootcamp course review need a rating between 1 and 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Prevent user from submitting more than one review per bootcamp
BootcampCourseReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// calculate rating of the bootcamp
BootcampCourseReviewSchema.statics.getAverageRating = async function(
  bootcampId,
) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  // add this average rating into the bootcamp model
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error('Ther as an error calculating average rating: ', error);
  }
};

// calculate average cost after save
BootcampCourseReviewSchema.post('save', async function() {
  this.constructor.getAverageRating(this.bootcamp);
});

// calculae average cost after remove
BootcampCourseReviewSchema.pre('remove', async function() {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model(
  'BootcampCourseReview',
  BootcampCourseReviewSchema,
);
