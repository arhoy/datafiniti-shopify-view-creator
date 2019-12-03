const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// require models
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/BootcampCourseReview');

// type : GET
// route: api/v1/bootcamps/:bootcampId/reviews
// desc: Get all the reviews for a particular bootcamp
// access: Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// type : POST
// route: api/v1/bootcamps/:bootcampId/reviews
// desc: Add a bootcamp course review
// access: Must be logged in
exports.addReview = asyncHandler(async (req, res, next) => {
  // add to the req.body
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;

  // check to see if bootcamp is in the db
  if (!(await Bootcamp.findById(req.params.bootcampId))) {
    next(new ErrorResponse('There is no bootcamp with that id', 404));
  }
  // create the new review
  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

// type : GET
// route: api/v1/bootcampcoursereview/:id
// desc: Get all the reviews for a particular bootcamp
// access: Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse('Bootcamp Course review was not found', 404));
  }

  res.status(200).json({ success: true, data: review });
});

// type : PUT
// route: api/v1/bootcampcoursereview/:id
// desc: Update the specific bootcampcoursereview id
// access: Must be logged in, and must be their own review, or admin
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  // review not found
  if (!review) {
    return next(new ErrorResponse('Review was not found!', 404));
  }

  // ensure review belongs to user or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Review must be updated by the user!', 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // ensure post save middleware gets run
  await review.save();

  return res.status(200).json({ success: true, data: review });
});

// type : PUT
// route: api/v1/bootcampcoursereview/:id
// desc: Update the specific bootcampcoursereview id
// access: Must be logged in, and must be their own review, or admin
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404),
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  await review.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
