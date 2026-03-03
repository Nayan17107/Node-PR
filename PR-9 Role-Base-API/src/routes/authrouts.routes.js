const express = require('express');
const { registeradmin, loginadmin } = require('../controller/admin.controller');
const upload = require('../middleware/uploadImage');

const routes = express.Router();

routes.post("/register-admin", upload.single('profileImage'), registeradmin);
routes.post("/login", loginadmin);

module.exports = routes;