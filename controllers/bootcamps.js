const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// type : GET
// route: api/v1/bootcamps
// desc: Get all the bootcamps
// access: Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// type : GET
// route: api/v1/bootcamps/:id
// desc: Get specific bootcamp
// access: Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with Id of ${req.params.id} was not founddd!`,
        404,
      ),
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// type : POST
// route: api/v1/bootcamps
// desc: Create a bootcamp
// access: Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user id to request body to add to database
  req.body.user = req.user.id;

  // check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // can only add one bootcamp if publisher
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('User has already one bootcamp published!', 401),
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  return res.status(200).json({ success: true, data: bootcamp });
});

// type : PUT
// route: api/v1/bootcamps/:id
// desc: Update a bootcamp
// access: Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  // check if bootcamp exists
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with Id of ${req.params.id} was not founddd!`,
        404,
      ),
    );
  }
  // check if bootcamp created user is the one updating. Admin can update any bootcamp
  if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You cannot update this bootcamp because it was not created by you!`,
        401,
      ),
    );
  }
  // Looks good!, update the bootcamp
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

// type : DELETE
// route: api/v1/bootcamps/:id
// desc: Delete a bootcamp
// access: Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with Id of ${req.params.id} was not founddd!`,
        404,
      ),
    );
  }

  // check if bootcamp created user is the one deleting. Admin can dekete any bootcamp
  if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You cannot delete this bootcamp because it was not created by you!`,
        401,
      ),
    );
  }

  // delete the bootcamp
  bootcamp.remove();
  res.status(200).json({ success: true, msg: 'DELETE bootcamp' });
});

// type : PUT
// route: api/v1/bootcamps/:id/photo
// desc: Upload a photo for a bootcamp
// access: Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  // bootcamp exists
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

  // check if bootcamp created user is the one updating. Admin can update any bootcamp
  if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You cannot update this bootcamp because it was not created by you!`,
        401,
      ),
    );
  }
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 404));
  }
  const file = req.files.file;
  // make sure the image is a photo
  if (!file.mimetype.startsWith('image/jpeg')) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload image less than ${process.env.MAX_FILE_UPLOAD}`,
        400,
      ),
    );
  }

  // create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // upload data
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse(
          `There was a problem uploading the file, please try again later`,
          500,
        ),
      );
    }

    // insert into db
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});

// type : GET
// route: api/v1/bootcamps/radius/:zipcode/:distance
// desc: Get bootcamps within radius of certain zipcode
// access: Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get lat and long from geocode
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    items: bootcamps.length,
    data: bootcamps,
  });
});
