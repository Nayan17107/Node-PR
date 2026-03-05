const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

exports.verifyTokenAdmin = async (req, res, next) => {
    let authorization = req.headers.authorization;
    if (!authorization) {
        return res.json({ message: 'Unauthorized' })
    }

    let token = authorization.split(" ")[1];
    let decode = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(decode);
    let admin = await User.findById(decode.userId)

    if (!admin) {
        return res.json({ message: "Invalid Token" });
    }
    if (admin.isDelete || admin.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: admin only' });
    }

    req.admin = admin;
    next();
};

exports.verifyTokenManager = async (req, res, next) => {
    let authorization = req.headers.authorization;
    if (!authorization) {
        return res.json({ message: 'Unauthorized' })
    }

    let token = authorization.split(" ")[1];
    let decode = jwt.verify(token, process.env.JWT_SECRET)
    let manager = await User.findById(decode.userId)

    if (!manager) {
        return res.json({ message: "Invalid Token" });
    }
    if (manager.isDelete || manager.role !== 'manager') {
        return res.status(403).json({ message: 'Forbidden: manager only' });
    }

    req.manager = manager;
    next();
};

exports.verifyTokenEmployee = async (req, res, next) => {
    let authorization = req.headers.authorization;
    if (!authorization) {
        return res.json({ message: 'Unauthorized' })
    }

    let token = authorization.split(" ")[1];
    let decode = jwt.verify(token, process.env.JWT_SECRET)
    let employee = await User.findById(decode.userId)

    if (!employee) {
        return res.json({ message: "Invalid Token" });
    }
    if (employee.isDelete || employee.role !== 'employee') {
        return res.status(403).json({ message: 'Forbidden: employee only' });
    }

    req.employee = employee;
    next();
};