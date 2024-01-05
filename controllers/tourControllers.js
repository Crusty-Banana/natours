const Tour = require('../models/tours');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTop5Cheap = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err.message,
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: err,
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(201).json({
            status: 'success',
            data: {
                tour: tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid Data Sent',
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        res.status(201).json({
            status: 'success',
            data: {
                tour: tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'No tour found with such id',
        });
    }
};
