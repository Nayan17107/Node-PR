const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: String,
    author: String,
    publishedDate: Date,
    price: Number,
    description: String
}, { timestamps: true });

module.exports = mongoose.model('books', bookSchema);