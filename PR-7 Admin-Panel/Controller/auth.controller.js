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