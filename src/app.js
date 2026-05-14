const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const httpStatus = require("http-status");

var indexRouter = require("./app/routes/index");
const ApiError = require("./utils/ApiError");
const { errorConverter, errorHandler } = require("./app/middleware/error");

const app = express();

app.use(helmet());
app.use(compression());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//cors
app.use(cors());
app.options("*", cors());

app.set("view engine", "ejs");

app.use("/api", indexRouter);

console.log("console form app.js", process.env.NODE_ENV);
app.use("/", (req, res) => {
    res.send("Portfolio Backend Server is Running!");
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
