const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require('../../controllers/auth');

// import models!
const User = require('../../models/User');

// init router
const router = express.Router();

// middleware
const { protect } = require('../../middleware/auth');

// routes!
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;
