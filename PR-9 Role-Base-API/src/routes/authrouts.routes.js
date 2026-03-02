const express = require('express');
const { registeradmin } = require('../controller/admin.controller');

const routes = express.Router();

routes.post("/register-admin", uploadImage.single('profileImage'), registeradmin);

module.exports = routes;