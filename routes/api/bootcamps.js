// bring in each method from the controller
const express = require('express');

const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require('../../controllers/bootcamps');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// re route into other routers (gets passed as / in course router)
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

module.exports = router;
