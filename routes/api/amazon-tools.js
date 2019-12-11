const express = require('express');

const {
  getAllAmazonTool,
  getAmazonTool,
  createAmazonTool,
} = require('../../controllers/amazon-tool');

// import models
const AmazonTool = require('../../models/AmazonTool');

// init router
const router = express.Router();

// middleware
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

// routes!
router.route('/').get(advancedResults(AmazonTool), getAllAmazonTool);
router.route('/:slug').get(getAmazonTool);

// init protect on all routes below
router.use(protect);
// init authorize for admin only below
router.use(authorize('admin'));

router.route('/').post(createAmazonTool);

module.exports = router;
