const express = require('express');

const {
  getAmazonProducts,
  getAmazonProduct,
  createAmazonProduct,
} = require('../../controllers/amazonproducts');

// import models
const AmazonProduct = require('../../models/AmazonProduct');

// init router
const router = express.Router();

// middleware
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

// routes!
router.route('/').get(advancedResults(AmazonProduct), getAmazonProducts);
router.route('/:slug').get(getAmazonProduct);

// init protect on all routes below
router.use(protect);
// init authorize for admin only below
router.use(authorize('admin'));

router.route('/').post(createAmazonProduct);

module.exports = router;
