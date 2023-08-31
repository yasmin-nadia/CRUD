const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name has to be given"],
    },
    imdb: {
        type: Number,
        required: [true, "IMDB rating has to be given"],
        min: 0,
        max: 10,
    },
    director: {
        type: String,
        required: [true, "Director's name has to be given"],
    },
    release: {
        type: Date,
        required: [true, "Release date has to be given"],
    },
    genre: {
        type: String,
        required: [true, "Genre has to be given"],
    },
});

const Movies = mongoose.model("movies", moviesSchema);

module.exports = Movies;