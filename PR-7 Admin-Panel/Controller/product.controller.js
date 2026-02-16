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

exports.deletproduct = async (req, res) => {
    try {
        let id = req.params.id;
        let product = await ProductModel.findById(id);

        if (!product) {
            return res.redirect('/product/view-product');
        }

        let productImages = [];
        if (product.image && product.image !== "") {
            productImages.push(product.image);
        }
        if (product.images && product.images.length > 0) {
            productImages.push(...product.images.filter((img) => img && img !== ""));
        }

        productImages = [...new Set(productImages)];

        for (let image of productImages) {
            try {
                let imagepath = path.join(__dirname, '..', image);
                fs.unlinkSync(imagepath);
            } catch (err) {
                console.log('File Missing: ', err.message);
            }
        }

        await ProductModel.findByIdAndDelete(id);
        req.flash('success', "Product Deleted!!!!")
        return res.redirect('/product/view-product');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.editproduct = async (req, res) => {
    try {
        const id = req.params.id;
        let product = await ProductModel.findById(id);

        if (!product) {
            return res.redirect('/product/view-product');
        }

        let category = await CategoryModel.find();
        let subcategory = await SubCategoryModel.find({ categoryid: product.categoryid });
        let extracategory = await ExtracategoryModel.find({ subcategoryid: product.subcategoryid });

        res.render('product/EditProduct', { product, category, subcategory, extracategory });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.updateproduct = async (req, res) => {
    try {
        let id = req.params.id;
        let product = await ProductModel.findById(id);

        if (!product) {
            return res.redirect('/product/view-product');
        }

        let image = product.image || '';
        if (req.files && req.files.image && req.files.image[0]) {
            if (image !== '') {
                let imagepath = path.join(__dirname, '..', image);
                try {
                    fs.unlinkSync(imagepath);
                } catch (err) {
                    console.log('File Missing: ', err.message);
                }
            }
            image = `/uploads/${req.files.image[0].filename}`;
        }

        let images = product.images || [];
        if (req.files && req.files.images && req.files.images.length > 0) {
            if (images.length > 0) {
                images.forEach((img) => {
                    if (img !== '') {
                        let imagepath = path.join(__dirname, '..', img);
                        try {
                            fs.unlinkSync(imagepath);
                        } catch (err) {
                            console.log('File Missing: ', err.message);
                        }
                    }
                });
            }

            images = req.files.images.map((file) => `/uploads/${file.filename}`);

            if (!(req.files.image && req.files.image[0])) {
                image = images[0] || image;
            }
        }

        await ProductModel.findByIdAndUpdate(
            id,
            { ...req.body, image, images },
            { new: true }
        );

        req.flash('success', "Product Updated!!!!")
        res.redirect('/product/view-product')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};


exports.viewsingleproduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id)
            .populate('categoryid', 'categoryname')
            .populate('subcategoryid', 'subcategoryname')
            .populate('extracategoryid', 'extracategoryname');

        if (!product) {
            return res.render('product/ViewSingleProduct', { product: null, gallery: [] });
        }

        let gallery = [];
        if (product.image) {
            gallery.push(product.image);
        }
        if (product.images && product.images.length > 0) {
            gallery.push(...product.images);
        }

        gallery = [...new Set(gallery)];

        res.render('product/ViewSingleProduct', { product, gallery })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

