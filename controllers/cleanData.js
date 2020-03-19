const rawData = require('../_data/rawdata.json');

const rawToCleanData = require('../utils/rawToCleanData');

exports.cleanData = (req, res, next) => {
  const cleanData = rawToCleanData(rawData.records);

  return res.status(200).json({ success: true, data: cleanData });
};
