const CategoryModel = require('../Model/category.model');
const SubCategoryModel = require('../Model/subcategory.model');
const ExtracategoryModel = require('../Model/extracategory.model');
const ProductModel = require('../Model/product.model');
const path = require('path');
const fs = require('fs');

exports.addproductpage = async (req, res) => {
    try {
        let category = await CategoryModel.find();
        let subcategory = [];
        let extracategory = [];
        res.render('product/AddProduct', { category, subcategory, extracategory });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategoryModel.find({ categoryid: req.params.id });
        return res.json({ message: 'Fetch all subcategory', subCategories });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
};

exports.getAllExtraCategories = async (req, res) => {
    try {
        const extraCategories = await ExtracategoryModel.find({ subcategoryid: req.params.id });
        return res.json({ message: 'Fetch all extracategory', extraCategories });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
};

exports.addproduct = async (req, res) => {
    try {
        let image = '';
        let images = [];

        if (req.files && req.files.image && req.files.image[0]) {
            image = `/uploads/${req.files.image[0].filename}`;
        }

        if (req.files && req.files.images && req.files.images.length) {
            images = req.files.images.map((file) => `/uploads/${file.filename}`);
            if (!image) {
                image = images[0];
            }
        }

        await ProductModel.create({
            ...req.body,
            image,
            images
        })
        req.flash('success', "Product Added!!!!")
        res.redirect('/product/add-product');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.viewproduct = async (req, res) => {
    try {
        let products = await ProductModel.find()
            .populate('categoryid', 'categoryname')
            .populate('subcategoryid', 'subcategoryname')
            .populate('extracategoryid', 'extracategoryname');

        res.render('product/ViewProduct', { products })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

// exports.deleteextracategory = async (req, res) => {
//     try {
//         let id = req.params.id;
//         let extracategory = await ExtracategoryModel.findById(id);

//         if (!extracategory) {
//             // console.log("Extra Category is not found");
//             return res.redirect('/extracategory/view-extracategory');
//         }

//         await ExtracategoryModel.findByIdAndDelete(id);
//         req.flash('success', "ExtraCategory Deleted!!!!")
//         return res.redirect('/extracategory/view-extracategory');
//     } catch (error) {
//         console.log(error)
//         res.redirect('/')
//     }
// };

// exports.editextracategory = async (req, res) => {
//     try {
//         const id = req.params.id;
//         // console.log(id);

//         let extracategory = await ExtracategoryModel.findById(id)
//         res.render('ExtraCategory/EditExtraCategory', { extracategory });
//     } catch (error) {
//         console.log(error)
//         res.redirect('/')
//     }
// };

// exports.updateectraCategory = async (req, res) => {
//     try {
//         let id = req.params.id;
//         // console.log(req.body.subcategory);

//         await ExtracategoryModel.findByIdAndUpdate(
//             id,
//             { ...req.body },
//             { new: true }
//         );

//         // console.log(subcategory)
//         req.flash('success', "ExtraCategory Updated!!!!")
//         res.redirect('/extracategory/view-extracategory')
//     } catch (error) {
//         console.log(error)
//     }
// };
