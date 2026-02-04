const express = require('express')
const { dashboard } = require('../Controller/index.controller');
const passport = require('passport');
const routes = express.Router()

routes.get('/',passport.checkAuthentication, dashboard);

routes.use('/blog', require('./blog.routes'));

routes.use('/category', require('./category.routes'));

routes.use('/admin', passport.checkAuthentication, require('./admin.routes'))

routes.use('/user', require('./auth.routes'))

module.exports = routes;