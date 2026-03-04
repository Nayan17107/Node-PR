const express = require('express');
const { registeradmin, loginadmin, adminprofile, updateadmin } = require('../controller/admin.controller');
const upload = require('../middleware/uploadImage');
const { verifyTokenAdmin } = require('../middleware/verifyToken')

const routes = express.Router();

routes.post("/register-admin", upload.single('profileImage'), registeradmin);
routes.post("/login-admin", loginadmin);
routes.get("/admin-profile", verifyTokenAdmin, adminprofile);
routes.post("/update-admin", verifyTokenAdmin, updateadmin);

module.exports = routes;
