const express = require("express");
const dbConnect = require("./config/dbConnection");

const port = 8002;
const app = express();

dbConnect();

app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use("/uploads", express.static("uploads"));

app.use("/", require("./routes/movie.routes"));

app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`);
});

