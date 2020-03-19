// FILE TAKES DATA AND TURNS INTO CSV

const ObjectsToCsv = require('objects-to-csv');

const moment = require('moment');

const datetime = moment()
  .format()
  .substring(0, 10);

const randomInt = Math.floor(Math.random() * 10000).toString();

const myFileName = datetime + '-' + randomInt;

// type : GET
// route: api/v1/datafiniti/test
// desc: Testing simple endpoint
// access: Public
exports.test = (req, res, next) => {
  console.log(req.root);
  return res.status(200).json({ success: true });
};

// type : GET
// route: api/v1/datafiniti
// desc: TURN DATA INTO CSV
// access: Public
exports.cleanDataToCSV = async (req, res, next) => {
  // req.root is coming from the middleware
  const productData = req.root;

  const csv = new ObjectsToCsv(productData);

  // Save to file:
  await csv.toDisk(`./results/test-${myFileName}.csv`);

  return res
    .status(200)
    .json({ msg: 'Please see data in results folder', data: productData });
};

// Sample data - two columns, three rows:
