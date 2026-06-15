const express = require('express');
const path = require('path');
const passport = require('passport')
require('./Middleware/localstrategy');
const session = require('express-session');
const flash = require('connect-flash');
const flashMessage = require('./Middleware/flashMessage');

const app = express()
const port = 8080;

require('./Config/dbconnection')()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use("/uploads", express.static(path.join(__dirname, 'uploads')))

app.use(session({
    name: 'login',
    secret: 'devlop',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.isAuthenticated)
app.use(flash())
app.use(flashMessage)

app.use('/', require('./Routes/index.routes'))

app.use('/web', require('./Routes/web.routes'))

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found')
})

// Global error handler
app.use((err, req, res, next) => {
    console.error('ERROR:', err)
    console.error('Stack:', err.stack)
    console.error('URL:', req.originalUrl)
    console.error('Method:', req.method)

    res.status(err.status || 500).send(`
        <h1>Internal Server Error</h1>
        <p>${err.message}</p>
        <pre>${err.stack}</pre>
    `)
})

app.listen(port, () => {
    console.log(`server start at http://localhost:${port}`)
})
