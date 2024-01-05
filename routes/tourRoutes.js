const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = express.Router();

// router.param('id', tourController.checkId);

router
    .route('/top-5-cheap')
    .get(tourController.aliasTop5Cheap, tourController.getAllTours);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
