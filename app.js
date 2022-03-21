const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const multer = require("multer");
const session = require('express-session');
const mongoStore = require('connect-mongo')
const flash = require('connect-flash');

const mainRoutes = require("./routes/mainRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const userRoutes = require("./routes/userRoutes");

// Create app
const app = express();

// Configure app
let port = 3000;
let host = "localhost";
app.set("view engine", "ejs");

// Connect to mongoose and start server
mongoHost = "localhost"
mongoPort = "27018"
mongoUrl = "mongodb://" + mongoHost + ":" + mongoPort + "/tradebay"
mongoose.connect(mongoUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => app.listen(port, host, () => console.log('Server is running on port', port)))
    .catch(err => console.log(err.message));

// Set The Storage Engine
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + "-" + file.originalname);
    }
});

// Mount Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage }).single("image"));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(session({
    secret: 'vs332qwe34t56432412345',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    store: new mongoStore({ mongoUrl: mongoUrl })
}))

app.use(flash());

app.use((req, res, next) => {
    // console.log(req.flash())
    console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// Main routes
app.use("/", mainRoutes);
// Trades Routes
app.use("/trades", tradeRoutes);
// User Routes
app.use("/users", userRoutes);

// Unknown page Route
app.use((req, res, next) => {
    let err = new Error("The server cannot locate " + req.url);
    err.status = 404;
    next(err);
});

// Error Route => Don't print stack trace on webpage
app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error!");
    }
    res.status(err.status)
    res.render("error", { title: "Error", error: err })
})