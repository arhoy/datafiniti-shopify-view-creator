const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../../controllers/bootcampCourseReview');

const Review = require('../../models/BootcampCourseReview');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

router.route('/').get(
  advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getReviews,
);
router.route('/:id').get(getReview);

// init protect on all routes below
router.use(protect);
// init authorize for admin or user only below
router.use(authorize('admin', 'user'));
router.route('/').post(addReview);
router
  .route('/:id')
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;
