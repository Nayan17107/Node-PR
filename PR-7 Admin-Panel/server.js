const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const localstrategy = require('./Middleware/localstrategy');
const fleshMessage = require('./Middleware/fleshMessage');
const dbconnection = require('./Config/dbconnection');

const app = express();
const port = 8080;

dbconnection();

// middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'));
app.use("/uploads", express.static('uploads'));

app.use(session({
    name: 'login',
    secret: 'devlop',
    saveUninitialized: false,
    resave: false, 
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false 
    }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(fleshMessage);

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.flashMessages = req.flash();
    next();
});

app.use('/', require('./Routes/index.routes'));

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});