const BookModel = require("../model/book.model");

exports.dashboardPage = async (req, res) => {
    try {
        let books = await BookModel.find();
        let count = books.length;
        return res.render("index", { books, count });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

exports.addBook = async (req, res) => {
    try {
        await BookModel.create({ ...req.body });
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

exports.deleteBook = async (req, res) => {
    try {
        let id = req.params.id;
        let book = await BookModel.findById(id);
        if (!book) {
            console.log("book is not found");
            return res.redirect("/");
        }
        await BookModel.findByIdAndDelete(id);
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

exports.editBook = async (req, res) => {
    try {
        let id = req.params.id;
        let book = await BookModel.findById(id);
        if (!book) {
            console.log("book is not found");
            return res.redirect("/");
        }
        return res.render("editBook", { book });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

exports.updateBook = async (req, res) => {
    try {
        let id = req.params.id;
        let book = await BookModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};