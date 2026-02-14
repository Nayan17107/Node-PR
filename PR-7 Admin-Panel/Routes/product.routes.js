const express = require('express');
const { addproductpage, getAllSubCategories, getAllExtraCategories, addproduct, viewproduct } = require('../Controller/product.controller');
const upload = require('../Middleware/ImageUpload');
const routes = express.Router();

routes.get('/add-product', addproductpage);
routes.get('/subcategory/:id', getAllSubCategories);
routes.get('/extracategory/:id', getAllExtraCategories);
routes.post('/add-product', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), addproduct);
routes.get('/view-product', viewproduct);
// routes.get('/delete-extracategory/:id', deleteextracategory);
// routes.get('/edit-extracategory/:id', editextracategory);
// routes.post('/update-extracategory/:id', updateectraCategory);

module.exports = routes;
