const express = require('express');

const routes = express.Router();

routes.use('/admin', require('./authrouts.routes'));
routes.use('/manager', require('./managerrouts.routes'));
routes.use('/employee', require('./employeerouts.routes'));

module.exports = routes;
