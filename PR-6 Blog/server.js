const dbconnection = require('./Config/dbconnection')
const express = require('express');
const port = 8003;
const app = express();

// DB Connection
dbconnection()

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('Public'));
app.use("/uploads", express.static('Uploads'))

// Routes
app.use('/', require('./Routes/index.routes'))

app.listen(port, () => {
    console.log(`Server is started at http://localhost:${port}`);
});