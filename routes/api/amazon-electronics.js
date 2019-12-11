const express = require('express');

const {
  getAllAmazonElectronic,
  getAmazonElectronic,
  createAmazonElectronic,
} = require('../../controllers/amazon-electronic');

// import models
const AmazonElectronic = require('../../models/AmazonElectronic');

// init router
const router = express.Router();

// middleware
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

// routes!
router
  .route('/')
  .get(advancedResults(AmazonElectronic), getAllAmazonElectronic);
router.route('/:slug').get(getAmazonElectronic);

// init protect on all routes below
router.use(protect);
// init authorize for admin only below
router.use(authorize('admin'));

router.route('/').post(createAmazonElectronic);

module.exports = router;
