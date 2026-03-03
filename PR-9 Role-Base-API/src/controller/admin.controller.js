const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registeradmin = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if(user && user.isDelete == false){
            return res.json({message: 'User already exist'})
        }
        
        let imagepath = "";
        if(req.file){
            imagepath = `/uploads/${req.file.filename}`;
        }

        let hashPassword = await bcrypt.hash(req.body.password, 12);
        user = await User.create({
            ...req.body,
            password: hashPassword,
            profileImage: imagepath
        });
        return res.json({message: 'Admin Registed', user});
    } catch (error) {
        console.log(error);
        return res.json({message: 'Server error'})
    }
}

exports.loginadmin = async (req, res) => {
    try {
        let admin = await User.findOne({email: req.body.email, isDelete: false})
        if(!admin){
            return res.status(404).json({message: 'Admin not found'});
        }

        let match = await bcrypt.compare(req.body.password, admin.password);
        if(!match){
            return res.json({message: 'Email or Password is incorrect'});
        }
        let token = jwt.sign({ userId: admin._id}, process.env.JWT_SECRET)
        return res.json({message: 'Login Success', status: 200, token})
    } catch (error) {
        console.log(error);
        return res.json({message: 'Server error'})
    }
}