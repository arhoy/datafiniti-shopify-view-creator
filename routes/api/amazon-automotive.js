const express = require('express');

const {
  getAllAmazonAutomotive,
  getAmazonAutomotive,
  createAmazonAutomotive,
} = require('../../controllers/amazon-automotive');

// import models
const AmazonAutomotive = require('../../models/AmazonAutomotive');

// init router
const router = express.Router();

// middleware
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

// routes!
router
  .route('/')
  .get(advancedResults(AmazonAutomotive), getAllAmazonAutomotive);
router.route('/:slug').get(getAmazonAutomotive);

// init protect on all routes below
router.use(protect);
// init authorize for admin only below
router.use(authorize('admin'));

router.route('/').post(createAmazonAutomotive);

module.exports = router;
