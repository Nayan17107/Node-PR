const BlogModel = require("../Model/blog.model")

exports.addblogpage = async (req, res) => {
    try {
        res.render('Blog/AddBlog')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.addblog = async (req, res) => {
    try {
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`
        }

        await BlogModel.create({
            ...req.body,
            image: imagepath
        })
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}
