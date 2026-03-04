const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendMail = require('../middleware/sendMail');
const fs = require('fs');
const path = require('path');

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
        let admin = await User.findOne({ _id: req.admin._id, isDelete: false });
        return res.json({ message: 'Admin Profile', admin });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' })
    }
};

exports.updateadmin = async (req, res) => {
    try {
        const adminId = req.admin._id;
        let updateData = { ...req.body };
        const admin = await User.findById(adminId).select('profileImage');

        if (req.file && req.file.filename) {
            if (admin && admin.profileImage) {
                const oldImageRelativePath = admin.profileImage.startsWith('/')
                    ? admin.profileImage.slice(1)
                    : admin.profileImage;
                const oldImageFullPath = path.join(__dirname, '..', oldImageRelativePath);

                try {
                    fs.unlinkSync(oldImageFullPath);
                    console.log('Deleted old image:', oldImageFullPath);
                } catch (err) {
                    console.log('Old image missing:', err.message);
                }
            }
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }

        delete updateData.role;
        delete updateData.isDelete;

        if (updateData.password) {
            delete updateData.password;
        }

        let updated = await User.findByIdAndUpdate(adminId, updateData, { new: true });
        return res.json({ message: 'Admin Updated', admin: updated });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' })
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body || {};
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Both old and new passwords are required' });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ message: 'New password must be different from old password' });
        }

        const admin = await User.findById(req.admin._id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        let match = await bcrypt.compare(oldPassword, admin.password);
        if (!match) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        let hash = await bcrypt.hash(newPassword, 12);
        admin.password = hash;
        await admin.save();
        return res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.deleteadmin = async (req, res) => {
    try {
        const adminId = req.admin._id;
        await User.findByIdAndUpdate(adminId, { isDelete: true });
        return res.json({ message: 'Admin deleted (soft delete)' });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.addManager = async (req, res) => {
    try {
        let { firstname, lastname, email, password, mobileNo, gender } = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: 'firstname, lastname, email and password are required' });
        }

        let existing = await User.findOne({ email, isDelete: false });
        if (existing) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        let managerData = { firstname, lastname, email, password, mobileNo, gender, role: 'manager' };
        if (req.file) {
            managerData.profileImage = `/uploads/${req.file.filename}`;
        }

        managerData.password = await bcrypt.hash(password, 12);

        let manager = await User.create(managerData);

        let mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: manager.email,
            subject: 'You have been added as Manager',
            text: `Hello ${manager.firstname},

            You have been added as a manager by the admin. Your login credentials are:

            Email: ${manager.email}
            Password: ${password}

            Please change your password after first login.
        `};

        sendMail(mailOptions).catch(err => console.log('mailer error', err));

        return res.json({ message: 'Manager created', manager });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.getAllManagers = async (req, res) => {
    try {
        let managers = await User.find({ role: 'manager', isDelete: false });
        return res.json({ message: 'All Managers', managers });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.deleteManager = async (req, res) => {
    try {
        const { managerId } = req.params;
        if (!managerId) {
            return res.status(400).json({ message: 'Manager ID is required' });
        }

        let manager = await User.findById(managerId);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        if (manager.role !== 'manager') {
            return res.status(400).json({ message: 'User is not a manager' });
        }

        await User.findByIdAndUpdate(managerId, { isDelete: true });
        return res.json({ message: 'Manager deleted (soft delete)' });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.changeManagerPassword = async (req, res) => {
    try {
        const { managerId } = req.params;
        const { newPassword } = req.body;

        if (!managerId) {
            return res.status(400).json({ message: 'Manager ID is required' });
        }

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        let manager = await User.findById(managerId);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        if (manager.role !== 'manager') {
            return res.status(400).json({ message: 'User is not a manager' });
        }

        let hash = await bcrypt.hash(newPassword, 12);
        manager.password = hash;
        await manager.save();

        // optionally send email to manager about password change
        let mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: manager.email,
            subject: 'Your Password has been Changed by Admin',
            text: `Hello ${manager.firstname},

Your password has been changed by the admin.

New Password: ${newPassword}

Please change it immediately after logging in.
`        };

        sendMail(mailOptions).catch(err => console.log('mailer error', err));

        return res.json({ message: 'Manager password changed successfully' });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

