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