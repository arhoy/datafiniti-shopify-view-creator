const express = require('express');

const {
  getAllReviews,
  createNewReview,
  getSpecificReview,
  updateSpecificReview,
  deleteSpecificReview,
  getAllReviewsForSpecificProduct,
  likeAReview,
  unlikeAReview,
} = require('../../controllers/review');

// models
const Review = require('../../models/Review');
// init router
const router = express.Router();

// middleware
const advancedResults = require('../../middleware/advancedResults');
const { protect } = require('../../middleware/auth');

// routes!
router.route('/').get(advancedResults(Review), getAllReviews);
router
  .route('/:productSlug')
  .get(advancedResults(Review), getAllReviewsForSpecificProduct);

router.route('/review/:reviewId').get(getSpecificReview);

// init protect on all routes below
router.use(protect);

// edit specific review
router
  .route('/review/:reviewId')
  .put(updateSpecificReview)
  .delete(deleteSpecificReview);

// new review for productSlug
router.route('/review/:productSlug').post(createNewReview);

// like | unlike reviews
router.route('/like/:reviewId').put(likeAReview);
router.route('/unlike/:reviewId').put(unlikeAReview);

module.exports = router;
