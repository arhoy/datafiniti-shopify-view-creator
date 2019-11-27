const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// type : GET
// route: api/v1/bootcamps
// desc: Get all the bootcamps
// access: Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // build up query part 1
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // build up query part 2
  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(
    /\b(gt|gte|lte|lt|in)\b/g,
    match => `$${match}`,
  );

  query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    // mongoose select
    query = query.select(fields);
  }

  // sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');

    // mongoose sort
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // execute the query
  const bootcamps = await query;

  // pagination result;
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    items: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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
  const bootcamp = await Bootcamp.create(req.body);
  return res.status(200).json({ success: true, data: bootcamp });
});

// type : PUT
// route: api/v1/bootcamps/:id
// desc: Update a bootcamp
// access: Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with Id of ${req.params.id} was not founddd!`,
        404,
      ),
    );
  }
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

  bootcamp.remove();
  res.status(200).json({ success: true, msg: 'DELETE bootcamp' });
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
