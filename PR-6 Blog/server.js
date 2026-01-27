const express = require('express');
const port = 8003;
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static('Public'));

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/view-blog', (req, res) => {
    res.render('Blog/ViewBlog')
})

app.get('/add-blog', (req, res) => {
    res.render('Blog/AddBlog')
})

app.listen(port, () => {
    console.log(`Server is started at http://localhost:${port}`);
});