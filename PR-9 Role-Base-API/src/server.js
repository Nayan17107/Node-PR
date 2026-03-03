const express = require("express");
require('dotenv').config({ path: 'src/.env' });
const port = process.env.PORT;
const app = express();
const dbConnect = require("./config/dbConnect");
const morgan = require('morgan');
const cors = require('cors');

//DB Connection
dbConnect();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded());
app.use(express.json());
app.use("/uploads", express.static('src/uploads'));


//routes
app.use("/", require("./routes/index.routes"));


app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`);
});
