const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registeradmin = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user && user.isDelete == false) {
            return res.json({ message: 'User already exist' })
        }

        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`;
        }

        let hashPassword = await bcrypt.hash(req.body.password, 12);
        user = await User.create({
            ...req.body,
            password: hashPassword,
            profileImage: imagepath
        });
        return res.json({ message: 'Admin Registed', user });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' })
    }
}

exports.loginadmin = async (req, res) => {
    try {
        // console.log(req.body);
        let admin = await User.findOne({ email: req.body.email, isDelete: false })
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        let matchPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!matchPassword) {
            return res.json({ message: 'Email or Password is incorrect' });
        }
        let token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET)
        return res.json({ message: 'Login Success', status: 200, token })
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' })
    }
}

exports.adminprofile = async (req, res) => {
    try {
        let admin = await User.findOne({ isDelete: false });
        // console.log(admin);
        return res.json({ message: 'Admin Profile', admin });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' })
    }
};

exports.updateadmin = async (req, res) => {
    try {
        // const adminId = req.admin._id; 
        // console.log(adminId);
        console.log(req.body);
        return res.json({ message: 'Admin Updated' });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' })
    }
};
