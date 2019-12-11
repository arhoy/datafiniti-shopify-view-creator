const express = require('express');

const {
  getAllAmazonHomeAndDecore,
  getAmazonHomeAndDecore,
  createAmazonHomeAndDecore,
} = require('../../controllers/amazon-home-and-decore');

// import models
const AmazonHomeAndDecore = require('../../models/AmazonHomeAndDecore');

// init router
const router = express.Router();

// middleware
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

// routes!
router
  .route('/')
  .get(advancedResults(AmazonHomeAndDecore), getAllAmazonHomeAndDecore);
router.route('/:slug').get(getAmazonHomeAndDecore);

// init protect on all routes below
router.use(protect);
// init authorize for admin only below
router.use(authorize('admin'));

router.route('/').post(createAmazonHomeAndDecore);

module.exports = router;
