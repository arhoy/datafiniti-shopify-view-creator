// calling the AMAZON PRODUCT API
const express = require('express');

const { cleanData } = require('../../controllers/cleanData');
const { cleanDataToCSV, test } = require('../../controllers/datafiniti');

// require middlware
const cleanDataMiddleware = require('../../middleware/cleanDataMiddleware');

// init router
const router = express.Router();

// routes!
router.route('/').get(cleanDataMiddleware, cleanDataToCSV);
router.route('/clean').get(cleanData);
router.route('/test').get(cleanDataMiddleware, test);

module.exports = router;
