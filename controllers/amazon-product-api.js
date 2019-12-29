const amazon = require('amazon-product-api');

// type : GET
// route: api/v1/amazon-products-api
// desc: Get the amazon products
// access: Public
exports.getAmazonProductAPI = (req, res, next) => {
  const client = amazon.createClient({
    awsId: process.env.awsId,
    awsSecret: process.env.awsSecret,
    awsTag: process.env.awsTag,
  });
  client
    .itemSearch({
      keywords: req.query.keywords || 'iphone',
      searchIndex: 'All',
      responseGroup: 'ItemAttributes,Offers,Images',
      availability: 'Available',
      domain: 'webservices.amazon.ca',
    })
    .then(function(results) {
      return res.status(200).json({ sucess: true, data: results });
    })
    .catch(function(err) {
      console.log('There as an error: ', err);
      return res.status(400).json({ success: false, data: {} });
    });
};

// type : GET
// route: api/v1/amazon-products-api/test
// desc: Get the amazon products
// access: Public
exports.getAmazonTest = (req, res, next) => {
  return res
    .status(200)
    .json({ success: true, data: {}, keyword: req.query.keywords });
};
