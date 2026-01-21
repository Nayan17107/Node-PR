const express = require("express");

const { dashboardPage, addMovie, deleteMovie, editMovie, updateMovie } = require("../controller/movie.controller");
const upload = require("../middleware/uploadimgs");
const routes = express.Router();

routes.get("/", dashboardPage);

routes.post("/add-movie", upload.single("poster"), addMovie);

routes.get("/delete-movie/:id", deleteMovie);

routes.get("/edit-movie/:id", editMovie);

routes.post("/update-movie/:id", upload.single("poster"), updateMovie);

module.exports = routes;

