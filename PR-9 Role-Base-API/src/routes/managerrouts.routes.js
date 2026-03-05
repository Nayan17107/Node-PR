const express = require('express');
const { loginManager, managerProfile, updateManagerProfile, getAllManagers, createEmployee, getAllEmployees, updateEmployee, deleteEmployee } = require('../controller/manager.controller');
const upload = require('../middleware/uploadImage');
const { verifyTokenManager } = require('../middleware/verifyToken');
const routes = express.Router();

routes.post("/login-manager", loginManager);
routes.get("/manager-profile", verifyTokenManager, managerProfile);
routes.post("/update-manager-profile", verifyTokenManager, upload.single('profileImage'), updateManagerProfile);
routes.get("/all-managers", verifyTokenManager, getAllManagers);
routes.post("/create-employee", verifyTokenManager, upload.single('profileImage'), createEmployee);
routes.get("/all-employees", verifyTokenManager, getAllEmployees);
routes.post("/update-employee/:employeeId", verifyTokenManager, upload.single('profileImage'), updateEmployee);
routes.delete("/delete-employee/:employeeId", verifyTokenManager, deleteEmployee);

module.exports = routes;