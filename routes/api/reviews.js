const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Review = require('../../models/Review');

// Name         :   Create new review
// Type         :   POST
// Route        :   api/reviews/:productSlug
// Description  :   User creates new review for specific product Slug
// Access       :   Any one logged in can create a review
router.post(
  '/:productSlug',
  auth,
  [
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
      const { rating, description } = req.body;
      const review = await new Review({
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
router.get('/', auth, async (req, res) => {
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

// Name         :   Get all reviews for a specific product
// Type         :   GET
// Route        :   api/reviews/:productSlug
// Description  :   Returns all of the reviews for a specific product slug
// Access       :   Public, anyone call see the reviews
router.get('/:productSlug', auth, async (req, res) => {
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

module.exports = router;
