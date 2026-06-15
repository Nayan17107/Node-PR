const mongoose = require('mongoose');

const dbconnection = () => {
    mongoose.connect('mongodb://localhost:27017/Admin-Panel')
        .then(() => console.log('DB is connected!!!!'))
        .catch(err => console.log(err))
}

module.exports = dbconnection;