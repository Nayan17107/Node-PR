const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
    {
        title: String,
        director: String,
        releaseDate: Date,
        rating: Number,
        description: String,
        poster: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("movies", movieSchema);
