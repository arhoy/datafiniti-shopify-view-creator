const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const asyncHandler = require('../middleware/async');

// type : GET
// route: api/v1/reviews
// desc: Get all the product reviews
// access: Public
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// Name         :   Create new review
// Type         :   POST
// Route        :   api/v1/reviews/review/:productSlug
// Description  :   User creates new review for specific product Slug
// Access       :   Any one logged in can create a review
exports.createNewReview = asyncHandler(async (req, res, next) => {
  console.log('creating review'.yellow.bold);
  const { rating, description, title } = req.body;

  const review = await new Review({
    title,
    user: req.user.id,
    productSlug: req.params.productSlug,
    description,
    rating,
  });

  await review.save();
  res.status(200).json({ success: true, data: review });
});

// Name         :   Get specific review
// Type         :   GET
// Route        :   api/v1/reviews/:reviewId
// Description  :   Returns specific review
// Access       :   Public
exports.getSpecificReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review)
    return next(
      new ErrorResponse(
        `Product review was not found with id ${reviewId}`,
        400,
      ),
    );

  res.status(200).json({ success: true, data: review });
});

// Name         :   Edit specific review
// Type         :   PUT
// Route        :   api/v1/reviews/review/:reviewId
// Description  :   Edit the specific review
// Access       :   Only user can edit review
exports.updateSpecificReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ msg: 'Review not found!' });
  if (review.user.id.toString() !== req.user.id && req.user.role !== 'admin')
    return res
      .status(401)
      .json({ msg: 'User is not authorized to edit this review!' });

  // review okay to edit
  const { rating, description, title } = req.body;

  const editedReview = await Review.findByIdAndUpdate(
    req.params.reviewId,
    { $set: { rating, description, title } },
    { new: true },
  );

  res.status(200).json({ success: true, data: editedReview });
});

// Name         :   Delete specific review
// Type         :   DELETE
// Route        :   api/v1/reviews/review/:reviewId
// Description  :   Delete a specific review
// Access       :   Private, only logged user can delete his or her review
exports.deleteSpecificReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) return res.status(404).json({ msg: 'Review not found' });

  // check user
  if (review.user.id.toString() !== req.user.id && req.user.role !== 'admin')
    return res
      .status(401)
      .json({ msg: 'User not authorized to delete this review' });

  // remove the review from db
  await review.remove();
  res.json({ success: true, data: {} });
});

// Name         :   Get all reviews for a specific product
// Type         :   GET
// Route        :   api/v1/reviews/:productSlug
// Description  :   Returns all of the reviews for a specific product slug
// Access       :   Public, anyone call see the reviews
exports.getAllReviewsForSpecificProduct = asyncHandler(
  async (req, res, next) => {
    const reviews = await Review.find({ productSlug: req.params.productSlug });
    if (!reviews) {
      next(
        new ErrorResponse('Was not able to find review for the product', 404),
      );
    }
    res.status(200).json(res.advancedResults);
  },
);

// Name         :   Like a specific review
// Type         :   PUT
// Route        :   api/v1/reviews/like/:reviewId
// Description  :   Like a specific review.
// Access       :   Must be authenticated to like a review
exports.likeAReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  // check if review exists
  if (!review) {
    return next(new ErrorResponse('Could not find this review', 404));
  }

  // check if the review has already been liked.
  if (
    review.likes.filter(like => like.user.toString() === req.user.id).length > 0
  ) {
    return next(new ErrorResponse('Review has already been liked', 400));
  }

  // add like, save to db, return likes
  review.likes.unshift({ user: req.user.id });
  await review.save();
  res.json({ success: true, data: review.likes });
});

// // Name         :   Remove like
// // Type         :   PUT
// // Route        :   api/v1/reviews/unlike/:reviewId
// // Description  :   UnLike a specific review.
// // Access       :   Must be authenticated to like a review
exports.unlikeAReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  // check if review exists
  if (!review) {
    return res.status(400).json({ msg: 'Review was not found!' });
  }
  // check if the review has not been liked yet
  if (
    review.likes.filter(like => like.user.toString() === req.user.id).length ===
    0
  ) {
    return res.status(400).json({ msg: 'Review has not been like yet!' });
  }

  // remove review, save db, return likes array
  const removeIndex = review.likes
    .map(like => like.user.toString())
    .indexOf(req.user.id);
  review.likes.splice(removeIndex, 1);

  await review.save();

  res.json({ success: true, data: review.likes });
});
