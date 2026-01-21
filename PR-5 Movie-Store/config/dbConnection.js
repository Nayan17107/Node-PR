const mongoose = require("mongoose");

const dbConnect = () => {
    // mongoose.connect("mongodb://localhost:27017/MovieStore")
    mongoose.connect("mongodb+srv://Nayan:nayan%402006@cluster0.smklzxg.mongodb.net/MovieApp")
        .then(() => console.log("DB is Connected!!!!"))
        .catch((err) => console.log(err));
};

module.exports = dbConnect;

