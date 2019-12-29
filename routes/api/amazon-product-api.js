// calling the AMAZON PRODUCT API
const express = require('express');

const { getAmazonProductAPI } = require('../../controllers/amazon-product-api');

// init router
const router = express.Router();

// routes!
router.route('/').get(getAmazonProductAPI);

module.exports = router;
