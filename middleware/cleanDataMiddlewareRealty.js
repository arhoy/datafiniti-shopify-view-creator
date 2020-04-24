const rawData = require('../_data/rawdata.json');

const rawToCleanData = require('../utils/rawToCleanDataRealty');

const cleanDataMiddlware = (req, res, next) => {
  const cleanData = rawToCleanData(rawData.records);
  req.root = cleanData;
  return next();
};

module.exports = cleanDataMiddlware;
