const express = require('express');

const {
  getAllProfiles,
  createProfile,
  deleteProfile,
  getCurrentProfile,
} = require('../../controllers/profile');

// models
const Profile = require('../../models/Profile');

// init router
const router = express.Router();

// middleware
const advancedResults = require('../../middleware/advancedResults');
const { protect } = require('../../middleware/auth');

// routes!
router.route('/').get(advancedResults(Profile), getAllProfiles);
router.route('/').post(protect, createProfile);
router.route('/').delete(protect, deleteProfile);
router.get('/me', protect, getCurrentProfile);

module.exports = router;
