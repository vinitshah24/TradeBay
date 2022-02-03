const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override")

const tradeRoutes = require("./routes/tradeRoutes");
const multer = require("multer");

// Create app
const app = express();

// Configure app
let port = 3000;
let host = "localhost";
app.set("view engine", "ejs");

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
app.use(multer({storage: fileStorage}).single("image"));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

// Setup routes
app.get("/", (req, res) => {
    res.render("index", {title: "Home"})
});

// Trades Routes
app.use("/trades", tradeRoutes);

app.get('/login', (req, res) => {
    //res.json(students);
    res.render('./user/login', {title: "Login"});
});

app.get('/signup', (req, res) => {
    //res.json(students);
    res.render('./user/signup', {title: "Signup"});
});

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
    res.render("error", {title: "Error" , error: err })
})

// Start the server
app.listen(port, host, () => {
    console.log("Server running on port", port)
})