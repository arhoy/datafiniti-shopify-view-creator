const ErrorResponse = require('../utils/errorResponse');
const AmazonProduct = require('../models/AmazonProduct');
const asyncHandler = require('../middleware/async');

// type : GET
// route: api/v1/amazonproducts
// desc: Get all the amazonproducts
// access: Public
exports.getAmazonProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// type : GET
// route: api/v1/amazonproducts/:slug
// desc: Get specific amazon product by slug
// access: Public
exports.getAmazonProduct = asyncHandler(async (req, res, next) => {
  const product = await AmazonProduct.findOne({ slug: req.params.slug });
  if (!product) {
    return next(
      new ErrorResponse('Did not find current product in the database'),
    );
  }
  return res.status(200).json({ success: true, data: product });
});

// type : POST
// route: api/v1/amazonproducts
// desc: Create a amazonproduct
// access: Private
exports.createAmazonProduct = asyncHandler(async (req, res, next) => {
  // Add user id to request body to add to database
  req.body.user = req.user.id;

  // can only add one bootcamp if admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Must be admin to create amazon product!', 401),
    );
  }
  const amazonproduct = await AmazonProduct.create(req.body);
  return res.status(200).json({ success: true, data: amazonproduct });
});
