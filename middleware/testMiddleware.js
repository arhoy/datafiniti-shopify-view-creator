//  description     logs request to the console
//  test logger not used in app.
const testMiddleWare = (req, res, next) => {
  const myData = [{ comany: 'Apple', price: '10000' }];
  req.root = myData;
  console.log('test was run');
  next();
};

module.exports = testMiddleWare;
