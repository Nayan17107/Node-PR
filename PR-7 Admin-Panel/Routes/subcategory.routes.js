const express = require('express');
const { addsubcategorypage, viewsubcategory, addsubcategory } = require('../Controller/subcategory.controller');
const routes = express.Router();

routes.get('/add-subcategory', addsubcategorypage);
routes.post('/add-subcategory', addsubcategory);
routes.get('/view-subcategory', viewsubcategory);

module.exports = routes;