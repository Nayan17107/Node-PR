const bcrypt = require('bcrypt')
const adminModel = require('../model/admin.model')
const otpgenerator = require('otp-generator')
const sendMail = require('../Middleware/sendmail')

exports.loginPage = async (req, res) => {
    try {
        res.render('auth/login')
    } catch (error) {
        console.log(error)
    }
}


exports.login = async (req, res) => {
    try {
        req.flash('success', 'Login Success')
        res.redirect('/')
    } catch (error) {

        console.log(error)
        res.redirect('/user/login')
    }
}


exports.logOut = async (req, res) => {
    try {
        req.flash('success', 'logout Success')
        req.session.destroy(() => {
            res.redirect('/user/login')
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}


exports.profilePage = (req, res) => {
    res.render('profile')
}



exports.changepasswordpage = async (req, res) => {
    try {
        res.render('auth/changePassword')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.changepassword = async (req, res) => {
    try {
        let { oldpassword, newpassword, confirmpassword } = req.body
        let user = req.user
        let comparepassword = await bcrypt.compare(oldpassword, user.password)
        if (!comparepassword) {
            req.flash('error', 'old password is Wrong')
            return res.redirect('/user/change-password')
        }

        if (newpassword !== confirmpassword) {
            req.flash('error', 'Confirm Password Not Match');
            return res.redirect('/user/change-password')
        }

        if (oldpassword == newpassword) {
            req.flash('error', 'New password must be different from the old password');
            return res.redirect('/user/change-password')
        }

        let hasepassword = await bcrypt.hash(newpassword, 10)
        console.log(hasepassword)
        let update = await adminModel.findByIdAndUpdate(user._id, {
            password: hasepassword
        }, { new: true })

        req.flash('success', 'Password Update');
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}



exports.sentopt = async (req, res) => {
    try {
        let admin = await adminModel.findOne({ email: req.body.email })
        if (!admin) {
            req.flash('error', 'Enter Valid Email')
            res.redirect('/user/login')
        }


        let otp = otpgenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
        req.session.forgetpassword = {
            email: req.body.email,
            otp: otp
        }
        let message = {
            from: "Prajapatinayan17107@gmail.com",
            to: req.body.email,
            subject: 'reset password OTP',
            html: `
            <h2>reset Password OTP Is ${otp}</h2>
        `
        }

        await sendMail(message)

        console.log(req.session.forgetpassword)

        res.render('auth/otpverification')
    } catch (error) {
        console.log(error)
        res.redirect('/user/login')
    }
}


exports.verifyotp = async (req, res) => {
    try {
        let { email, otp } = req.session.forgetpassword
        let userotp = req.body.verifyotp
        if (otp !== userotp) {
            req.flash('error', 'Enter Valid Otp')
            return res.render('auth/otpverification')
        }
        res.render('auth/resetpassword')
    } catch (error) {
        console.log(error)
    }
}

exports.resetpasswword = async (req, res) => {
    try {

        console.log(req.body)

        if (req.body.newpassword !== req.body.confirmpassword) {
            req.flash('error', 'Password Not Match')
            return res.render('auth/resetpassword')
        }
        let haspassword = await bcrypt.hash(req.body.newpassword, 10)
        let email = req.session.forgetpassword.email
        let admin = await adminModel.findOneAndUpdate({ email: email }, {
            password: haspassword
        }, { new: true })
        req.flash('success', 'Password Reset success')
        res.redirect('/user/login')
    } catch (error) {
        console.log(error)
        res.redirect('/user/verifyotp')
    }
}