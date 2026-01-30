const express = require('express');
const port = 8003;
const app = express();

require('./Config/dbconnection')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('Public'));
app.use("/uploads", express.static('Uploads'))

const blogRoutes = require('./Routes/blog.routes')
app.use('/blog', blogRoutes)


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/add-blog', (req, res) => {
    res.render('blog/AddBlog')
})

app.get('/view-blog', (req, res) => {
    res.render('blog/ViewBlog')
})

app.listen(port, () => {
    console.log(`Server is started at http://localhost:${port}`);
});