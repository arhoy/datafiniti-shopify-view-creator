//  description     logs request to the console
//  test logger not used in app.
const logger = (req, res, next) => {
  console.info(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originaUrl} `,
  );
  next();
};

module.exports = logger;
