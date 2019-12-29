const ErrorResponse = require('../utils/errorResponse');
const amazon = require('amazon-product-api');

const asyncHandler = require('../middleware/async');

// type : GET
// route: api/v1/amazon-home-and-decore
// desc: Get all the amazon-home-and-decore
// access: Public
exports.getAmazonProductAPI = asyncHandler(async (req, res, next) => {
  const client = amazon.createClient({
    awsId: 'AKIAITXTHLMBKKJZQ3TQ',
    awsSecret: '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',
    awsTag: 'fashionfive-20',
  });
  client
    .itemSearch({
      director: 'Quentin Tarantino',
      actor: 'Samuel L. Jackson',
      searchIndex: 'DVD',
      audienceRating: 'R',
      responseGroup: 'ItemAttributes,Offers,Images',
      itemPage: 1,
      availability: 'Available',
      domain: 'webservices.amazon.ca',
    })
    .then(function(results) {
      console.log('FUCKING RESULTS: ', results);
      return res.status(200).json({ sucess: true, data: results });
    })
    .catch(function(err) {
      console.log('FUCKING EH', err);
      return res.status(400).json({ success: false, data: {} });
    });
});
