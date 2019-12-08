// Review Model based on the Product Slug
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    productSlug: {
      type: String,
      required: [true, 'Review must be attached to a product slug'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Your product review must have a title!'],
      trim: true,
      maxlength: [30, 'Your review title must be less than 30 characters'],
      minlength: [10, 'Your review title must be 10 or more characters'],
    },
    description: {
      type: String,
      required: [true, 'Your review description must not be empty'],
      trim: true,
      maxlength: [
        300,
        'Your review description must be less than 300 characters',
      ],
      minlength: [10, 'Your review description must be 10 or more characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: [1, 'Your review rating must be one between 1 and 5 stars'],
      max: [5, 'Your review rating must be one between 1 and 5 stars'],
    },
    averageRating: {
      type: Number,
      min: [1, 'Your review rating must be one between 1 and 5 stars'],
      max: [5, 'Your review rating must be one between 1 and 5 stars'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

// No Duplicate reviews. One review per user for a given tour
ReviewSchema.index({ productSlug: 1, user: 1 }, { unique: true });

// Populate users info in the reviews
ReviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  next();
});

module.exports = Review = mongoose.model('Review', ReviewSchema);
