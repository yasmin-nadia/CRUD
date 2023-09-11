const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference to the User model
        required: true,
    }],
    manga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mangas', // Reference to the Manga model
        required: true,
    },
    reviewText: [{
        type: String,
        required: true,
        maxlength: 500,
    }],
    recommended: {
        type: Boolean,
        required: true,
    },
    like: {
        type: Number,
        default: 0,// Default value is false; change it according to your requirements
    },
    dislike: {
        type: Number,
        default: 0, // Default value is false; change it according to your requirements
    },
    rate: {
        type: Number,
        required:true

    }
});

const reviewModel = mongoose.model("reviews", reviewSchema);

module.exports = reviewModel;
