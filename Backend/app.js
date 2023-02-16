// const { urlencoded } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
// const { errorHandler } = require("./middlewares/errorMiddleware");
const connectDB = require("./config/db");
const passport = require("passport");

const port = process.env.PORT || 8000;

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/users/admin", require("./routes/adminRoutes"));
app.use("/users/coordinator", require("./routes/coordinatorRoutes"));

app.listen(port, () => console.log(`Server started on port ${port}`));
