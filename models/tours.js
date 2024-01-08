const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [20, 'A tour name must have less than 20 character'],
            minlength: [10, 'A tour name must have more than 10 character'],
            // validate: [validator.isAlpha, 'Tour name must only contain letter'],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour mus have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour mus have a max group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour mus have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty can only be easy, medium, difficulty',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Min is 1'],
            max: [5, 'Max is 5'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message:
                    'Discount price ({VALUE}) should be below regular price',
            },
        },
        summary: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre(/^find/, function (next) {
    try {
        this.find({ secretTour: { $eq: true } });
        next();
    } catch (err) {
        console.log(err);
    }
});

// tourSchema.pre('save', (next) => {
//     console.log('saving doc');
//     next();
// });

// tourSchema.post('save', (doc, next) => {
//     console.log(doc);
//     next();
// });

tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    console.log(this.pipeline());
    next();
});

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
