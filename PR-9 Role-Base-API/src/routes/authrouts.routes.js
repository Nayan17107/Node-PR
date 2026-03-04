const express = require('express');
const { registeradmin, loginadmin, adminprofile, updateadmin, changePassword, deleteadmin, addManager, getAllManagers, deleteManager, changeManagerPassword } = require('../controller/admin.controller');
const upload = require('../middleware/uploadImage');
const { verifyTokenAdmin } = require('../middleware/verifyToken')
const routes = express.Router();

routes.post("/register-admin", upload.single('profileImage'), registeradmin);
routes.post("/login-admin", loginadmin);
routes.get("/admin-profile", verifyTokenAdmin, adminprofile);
routes.post("/update-admin", verifyTokenAdmin, upload.single('profileImage'), updateadmin);
routes.post("/change-password", verifyTokenAdmin, changePassword);
routes.delete("/delete-admin", verifyTokenAdmin, deleteadmin);
routes.post("/add-manager", verifyTokenAdmin, upload.single('profileImage'), addManager);
routes.get("/managers", verifyTokenAdmin, getAllManagers);
routes.delete("/managers/:managerId", verifyTokenAdmin, deleteManager);
routes.post("/managers/:managerId/change-password", verifyTokenAdmin, changeManagerPassword);

module.exports = routes;
