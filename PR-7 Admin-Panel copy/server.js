const express = require('express');
require('dotenv').config(); // Load environment variables

const passport = require('passport')
require('./Middleware/localstrategy')    //use strategy
const session = require('express-session')

const flash = require('connect-flash');
const flashMessage = require('./Middleware/flashMessage');

// server configration
const app = express()
const port = 8080;

//database connection
require('./Config/dbconnection')()

// middalware
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use("/uploads", express.static('uploads'))

//   create session
app.use(session({
    name: 'login',
    secret: 'devlop',
    saveUninitialized: false,
    resave: false, // Changed from true to false to avoid deprecation warning
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

// connect passport and session
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.isAuthenticated)
//flash message
app.use(flash())
app.use(flashMessage)

// main route 
app.use('/', require('./Routes/index.routes'))

app.listen(port, () => {
    console.log(`server start at http://localhost:${port}`)
})