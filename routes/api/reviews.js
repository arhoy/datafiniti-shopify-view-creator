const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Review = require('../../models/Review');

// Name         :   Create new review
// Type         :   POST
// Route        :   api/reviews/review/:productSlug
// Description  :   User creates new review for specific product Slug
// Access       :   Any one logged in can create a review
router.post(
  '/review/:productSlug',
  auth,
  [
    check(
      'title',
      'Product title must be between 10 and 30 charaters',
    ).isLength({ min: 10, max: 30 }),
    check('description', 'Description is required!')
      .not()
      .isEmpty(),
    check('rating', 'Product Rating must be between 1 and 5').isIn([
      1,
      2,
      3,
      4,
      5,
    ]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { rating, description, title } = req.body;
      const review = await new Review({
        title,
        user: req.user.id,
        productSlug: req.params.productSlug,
        description,
        rating,
      });
      // save and return the review
      await review.save();
      res.json(review);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
);

// Name         :   Get all reviews
// Type         :   GET
// Route        :   api/reviews
// Description  :   Returns all of the reviews created
// Access       :   Public, anyone call see the reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json({
      status: 'success',
      items: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Name         :   Get specific review
// Type         :   GET
// Route        :   api/reviews/review/:reviewId
// Description  :   Returns specific review
// Access       :   Public
router.get('/review/:reviewId', async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found!' });

    res.json(review);
  } catch (error) {
    res.status(500).json({ msg: 'Could not find the review' });
  }
});

// Name         :   Edit specific review
// Type         :   PUT
// Route        :   api/reviews/review/:reviewId
// Description  :   Edit the specific review
// Access       :   Only user can edit review
router.put(
  'review/:reviewId',
  auth,
  [
    check(
      'title',
      'Product title must be between 10 and 30 charaters',
    ).isLength({ min: 10, max: 30 }),
    check('description', 'Description is required!')
      .not()
      .isEmpty(),
    check('rating', 'Product Rating must be between 1 and 5').isIn([
      1,
      2,
      3,
      4,
      5,
    ]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const review = await Review.findById(req.params.reviewId);
      if (!review) return res.status(404).json({ msg: 'Review not found!' });
      if (review.user.id.toString() !== req.user.id)
        return res
          .status(401)
          .json({ msg: 'User is not authorized to edit this review!' });

      // review okay to edit
      const { rating, description, title } = req.body;
      try {
        const editedReview = await Review.findByIdAndUpdate(
          req.params.reviewId,
          { $set: { rating, description, title } },
          { new: true },
        );

        res.json(editedReview);
      } catch (error) {
        res.status(400).json({ msg: 'Could not update the review' });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Could not find the review' });
    }
  },
);

// Name         :   Delete specific review
// Type         :   DELETE
// Route        :   api/reviews/review/:reviewId
// Description  :   Delete a specific review
// Access       :   Private, only logged user can delete his or her review
router.delete('/review/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) return res.status(404).json({ msg: 'Review not found' });

    // check user
    if (review.user.id.toString() !== req.user.id)
      return res.status(401).json({ msg: 'User not authorized' });

    // remove the review from db
    await review.remove();
    res.json({ msg: 'Your review has been deleted!' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Name         :   Get all reviews for a specific product
// Type         :   GET
// Route        :   api/reviews/:productSlug
// Description  :   Returns all of the reviews for a specific product slug
// Access       :   Public, anyone call see the reviews
router.get('/:productSlug', async (req, res) => {
  try {
    const reviews = await Review.find({ productSlug: req.params.productSlug });
    res.json({
      status: 'success',
      items: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Name         :   Like a specific review
// Type         :   PUT
// Route        :   api/reviews/like/:reviewId
// Description  :   Like a specific review.
// Access       :   Must be authenticated to like a review
router.put('/like/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    // check if review exists
    if (!review) {
      return res.status(400).json({ msg: 'Review was not found!' });
    }

    // check if the review has already been liked.
    if (
      review.likes.filter(like => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Review has already been liked!' });
    }

    // add like, save to db, return likes
    review.likes.unshift({ user: req.user.id });
    await review.save();
    res.json(review.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Name         :   Remove like
// Type         :   PUT
// Route        :   api/reviews/unlike/:reviewId
// Description  :   UnLike a specific review.
// Access       :   Must be authenticated to like a review
router.put('/unlike/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    // check if review exists
    if (!review) {
      return res.status(400).json({ msg: 'Review was not found!' });
    }
    // check if the review has not been liked yet
    if (
      review.likes.filter(like => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Review has not been like yet!' });
    }

    // remove review, save db, return likes array
    const removeIndex = review.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    review.likes.splice(removeIndex, 1);

    await review.save();

    res.json(review.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Errors');
  }
});

module.exports = router;
