const ErrorResponse = require('../utils/errorResponse');

const asyncHandler = require('../middleware/async');

// type :       GET
// route:       api/v1/profile
// desc:        Get all profiles
// access:      Everyone can see all profiles created
exports.getAllProfiles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// type :       GET
// route:       api/v1/profile/me
// desc:        Get logged in users profile
// access:      PRIVATE
exports.getCurrentProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  // check if profile exists
  if (!profile) {
    return next(new ErrorResponse('Profile was not found', 400));
  }
  // check if the user in profile matches the logged in user id.
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `Not authorized to access this profile ${profile.name}`,
        401,
      ),
    );
  }

  res.status(200).json({ success: true, data: profile });
});

// type : POST
// route: api/v1/profile
// desc: create or update the user profile
// access: Private
exports.createProfile = asyncHandler(async (req, res, next) => {
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
  res.status(200).json({ success: true, data: profile });
});

// // type : DELETE
// // route: api/v1/profile
// // desc: Delete profile for the logged in user
// // access: Private
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  await Profile.findByIdAndDelete(req.user.id);

  // send back profile
  res.status(200).json({ success: true, data: {} });
});
