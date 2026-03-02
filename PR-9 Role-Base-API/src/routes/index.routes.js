const express = require('express');

const routes = express.Router();

routes.post("/admin",  require('./authrouts.routes'));
routes.post("/manager",  require('./managerrouts.routes'));
routes.post("/employee",  require('./employeerouts.routes'));

module.exports = routes;