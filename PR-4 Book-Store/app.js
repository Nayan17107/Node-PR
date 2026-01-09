const express = require("express");
const dbConnect = require("./config/dbConnection");

const port = 8001;
const app = express();

// dbConnection
dbConnect();

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.use("/", require('./routes/book.routes'));

app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`);
});
