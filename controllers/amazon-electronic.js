const ErrorResponse = require('../utils/errorResponse');
const AmazonElectronic = require('../models/AmazonElectronic');
const asyncHandler = require('../middleware/async');

// type : GET
// route: api/v1/amazon-tools
// desc: Get all the amazon-tools
// access: Public
exports.getAllAmazonElectronic = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// type : GET
// route: api/v1/amazon-tools/:slug
// desc: Get specific amazon product by slug
// access: Public
exports.getAmazonElectronic = asyncHandler(async (req, res, next) => {
  const product = await AmazonElectronic.findOne({ slug: req.params.slug });
  if (!product) {
    return next(
      new ErrorResponse('Did not find current product in the database'),
    );
  }
  return res.status(200).json({ success: true, data: product });
});

// type : POST
// route: api/v1/amazon-tools
// desc: Create a amazonproduct
// access: Private
exports.createAmazonElectronic = asyncHandler(async (req, res, next) => {
  // Add user id to request body to add to database
  req.body.user = req.user.id;

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Must be admin to create amazon product!', 401),
    );
  }
  const amazonproduct = await AmazonElectronic.create(req.body);
  return res.status(200).json({ success: true, data: amazonproduct });
});
