const express = require('express');

const { dashboardPage, addBook, deleteBook, editBook, updateBook } = require('../controller/book.controller');
const routes = express.Router();

routes.get("/", dashboardPage);

routes.post("/add-book", addBook)

routes.get("/delete-book/:id", deleteBook)

routes.get("/edit-book/:id", editBook)

routes.post("/update-book/:id", updateBook)


module.exports = routes;