const express = require('express')
const { dashboard } = require('../Controller/index.controller')
const routes = express.Router()

routes.get('/', dashboard);

routes.use('/blog', require('./blog.routes'));

routes.use('/category', require('./category.routes'));

module.exports = routes;