const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String
    },
    profileImage: {
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },

    role: {
        type: String,
        enum: ['admin', 'manager', 'employee'],
        default: 'employee'
    },

    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);