const ErrorResponse = require('../utils/errorResponse');
const AmazonAutomotive = require('../models/AmazonAutomotive');
const asyncHandler = require('../middleware/async');

// type : GET
// route: api/v1/amazon-home-and-decore
// desc: Get all the amazon-home-and-decore
// access: Public
exports.getAllAmazonAutomotive = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

// type : GET
// route: api/v1/amazon-home-and-decore/:slug
// desc: Get specific amazon product by slug
// access: Public
exports.getAmazonAutomotive = asyncHandler(async (req, res, next) => {
  const product = await AmazonAutomotive.findOne({ slug: req.params.slug });
  if (!product) {
    return next(
      new ErrorResponse('Did not find current product in the database'),
    );
  }
  return res.status(200).json({ success: true, data: product });
});

// type : POST
// route: api/v1/amazon-home-and-decore
// desc: Create a amazonproduct
// access: Private
exports.createAmazonAutomotive = asyncHandler(async (req, res, next) => {
  // Add user id to request body to add to database
  req.body.user = req.user.id;

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Must be admin to create amazon product!', 401),
    );
  }
  const amazonproduct = await AmazonAutomotive.create(req.body);
  return res.status(200).json({ success: true, data: amazonproduct });
});
