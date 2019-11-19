const express = require('express');
const router = express.Router();

const config = require('config');
const { check, validationResult } = require('express-validator');

// require middleware and models
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// type:    GET
// route:   api/profile/me
// desc:    Get the current users profile
// access:  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name']);

    if (!profile) {
      return res.status(400).json({ msg: 'There was no profile found' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// type:    GET
// route:   api/profile
// desc:    Return all the profiles
// access:  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// type : POST
// route: api/profile
// desc: create or update the user profile
// access: Private
router.post(
  '/',
  auth,
  [
    check('location', 'Location is required!')
      .not()
      .isEmpty(),
    check('interests', 'Please tell us what you are interested in ')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req); // from check middleware above
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // get back an errors array from this middleware
      }
      // build user profile based on the req.body (user form input)
      const { location, phoneNumber, about, interests } = req.body;

      // initialize profile fields object. Manipulate user response to store in db
      const profileFields = {};
      profileFields.user = req.user.id;
      if (location) profileFields.location = location;
      if (phoneNumber) profileFields.phoneNumber = phoneNumber;
      if (about) profileFields.about = about;
      if (interests) {
        profileFields.interests = interests
          .split(',')
          .map(interests => interests.trim());
      }

      // update the profile
      try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
          // create profile
          profile = new Profile(profileFields);
          await profile.save();
          return res.json(profile);
        }
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },
        );

        // save profile
        await profile.save();
        // send back profile

        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// type : DELETE
// route: api/profile/:id
// desc: Delete profile for the logged in user
// access: Private
router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id });
    res.json({ msg: 'Profile has been deleted' });
  } catch (error) {
    res.status(400).json({ msg: 'Cannot delete/find profile at this time!' });
  }
});

module.exports = router;
