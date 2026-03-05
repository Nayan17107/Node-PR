const express = require('express');
const { loginEmployee, employeeProfile, getAllEmployees, updateEmployeeProfile, changeEmployeePassword } = require('../controller/employee.controller');
const upload = require('../middleware/uploadImage');
const { verifyTokenEmployee } = require('../middleware/verifyToken');
const routes = express.Router();

routes.post("/login-employee", loginEmployee);
routes.get("/employee-profile", verifyTokenEmployee, employeeProfile);
routes.get("/all-employees", verifyTokenEmployee, getAllEmployees);
routes.post("/update-employee-profile", verifyTokenEmployee, upload.single('profileImage'), updateEmployeeProfile);
routes.post("/change-password", verifyTokenEmployee, changeEmployeePassword);

module.exports = routes;