const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

exports.loginManager = async (req, res) => {
    try {
        let manager = await User.findOne({ email: req.body.email, isDelete: false, role: 'manager' });
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        let matchPassword = await bcrypt.compare(req.body.password, manager.password);
        if (!matchPassword) {
            return res.json({ message: 'Email or Password is incorrect' });
        }
        let token = jwt.sign({ userId: manager._id }, process.env.JWT_SECRET);
        return res.json({ message: 'Login Success', status: 200, token });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.managerProfile = async (req, res) => {
    try {
        let manager = await User.findOne({ _id: req.manager._id, isDelete: false });
        return res.json({ message: 'Manager Profile', manager });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.updateManagerProfile = async (req, res) => {
    try {
        const managerId = req.manager._id;
        let updateData = { ...req.body };
        const manager = await User.findById(managerId).select('profileImage');

        if (req.file && req.file.filename) {
            if (manager && manager.profileImage) {
                const oldImageRelativePath = manager.profileImage.startsWith('/')
                    ? manager.profileImage.slice(1)
                    : manager.profileImage;
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
        delete updateData.password; // Manager cannot change password

        let updated = await User.findByIdAndUpdate(managerId, updateData, { new: true });
        return res.json({ message: 'Manager Updated', manager: updated });
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

exports.createEmployee = async (req, res) => {
    try {
        let { firstname, lastname, email, password, mobileNo, gender } = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: 'firstname, lastname, email and password are required' });
        }

        let existing = await User.findOne({ email, isDelete: false });
        if (existing) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        let employeeData = { firstname, lastname, email, password, mobileNo, gender, role: 'employee' };
        if (req.file) {
            employeeData.profileImage = `/uploads/${req.file.filename}`;
        }

        employeeData.password = await bcrypt.hash(password, 12);

        let employee = await User.create(employeeData);

        return res.json({ message: 'Employee created', employee });
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

exports.updateEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        let updateData = { ...req.body };
        const employee = await User.findById(employeeId).select('profileImage role isDelete');

        if (!employee || employee.role !== 'employee' || employee.isDelete) {
            return res.status(404).json({ message: 'Employee not found' });
        }

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

        let updated = await User.findByIdAndUpdate(employeeId, updateData, { new: true });
        return res.json({ message: 'Employee Updated', employee: updated });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        if (!employeeId) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }

        let employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (employee.role !== 'employee') {
            return res.status(400).json({ message: 'User is not an employee' });
        }

        await User.findByIdAndUpdate(employeeId, { isDelete: true });
        return res.json({ message: 'Employee deleted (soft delete)' });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
};