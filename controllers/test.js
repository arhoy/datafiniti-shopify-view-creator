// type : GET
// route: api/v1/test
// desc: Testing simple endpoint
// access: Public
exports.getTest = (req, res, next) => {
  return res.status(200).json({ success: true });
};
