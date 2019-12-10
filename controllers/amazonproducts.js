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
