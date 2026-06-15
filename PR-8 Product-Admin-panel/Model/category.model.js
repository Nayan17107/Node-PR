const mongoose = require('mongoose')

const categorySchiema = mongoose.Schema({
    categoryname: {
        type: String
    },
    categoryimage: {
        type: String
    },
})

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchiema);