const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

exports.loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        let employee = await User.findOne({ email, isDelete: false, role: 'employee' });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        let matchPassword = await bcrypt.compare(password, employee.password);
        if (!matchPassword) {
            return res.json({ message: 'Email or Password is incorrect' });
        }

        let token = jwt.sign({ userId: employee._id }, process.env.JWT_SECRET);
        return res.json({ message: 'Login Success', status: 200, token });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.employeeProfile = async (req, res) => {
    try {
        let employee = await User.findOne({ _id: req.employee._id, isDelete: false });
        return res.json({ message: 'Employee Profile', employee });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        let employees = await User.find({ role: 'employee', isDelete: false });
        return res.json({ message: 'All Employees', employees });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.updateEmployeeProfile = async (req, res) => {
    try {
        const employeeId = req.employee._id;
        let updateData = { ...req.body };
        const employee = await User.findById(employeeId).select('profileImage');

        if (req.file && req.file.filename) {
            if (employee && employee.profileImage) {
                const oldImageRelativePath = employee.profileImage.startsWith('/')
                    ? employee.profileImage.slice(1)
                    : employee.profileImage;
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
        delete updateData.password; 

        let updated = await User.findByIdAndUpdate(employeeId, updateData, { new: true });
        return res.json({ message: 'Employee Profile Updated', employee: updated });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.changeEmployeePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body || {};
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Both old and new passwords are required' });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ message: 'New password must be different from old password' });
        }

        const employee = await User.findById(req.employee._id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        let match = await bcrypt.compare(oldPassword, employee.password);
        if (!match) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        let hash = await bcrypt.hash(newPassword, 12);
        employee.password = hash;
        await employee.save();
        
        return res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};
