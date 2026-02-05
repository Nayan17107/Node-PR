const SubCategoryModel = require('../Model/subcategory.model');
const CategoryModel = require('../Model/category.model');
const path = require('path');
const fs = require('fs');

exports.addsubcategorypage = async (req, res) => {
    try {
        let category = await CategoryModel.find();
        res.render('SubCategory/AddSubCategory', { category });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }

};

exports.addsubcategory = async (req, res) => {
    try {
        // console.log(req.body);
        await SubCategoryModel.create({
            ...req.body
        })
        res.redirect('/subcategory/add-subcategory');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.viewsubcategory = async (req, res) => {
    try {
        let subcategories = await SubCategoryModel.find()
        res.render('SubCategory/ViewSubCategory', { subcategories });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};