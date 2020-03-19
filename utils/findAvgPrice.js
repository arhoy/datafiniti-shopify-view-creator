const _ = require('lodash');

const findAvgPrice = prices => {
  const average = _.meanBy(prices, p => p.amountMax);
  return average;
};

module.exports = findAvgPrice;
