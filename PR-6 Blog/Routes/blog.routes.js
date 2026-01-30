const express = require('express')
const routes = express.Router();
const upload = require('../Middleware/ImageUpload');
const { addblog, addblogpage } = require('../Controller/blog.controller');

routes.get('/add-blog', addblogpage);
routes.post('/add-blog', upload.single('image'), addblog);


module.exports = routes