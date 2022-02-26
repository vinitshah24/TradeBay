const express = require("express");
const controller = require("../controllers/mainController")

const router = express.Router();

router.get("/", controller.index);
router.get('/about', controller.about);
router.get('/login', controller.login);
router.get('/signup', controller.signup);
router.get('/contact', controller.contact);

module.exports = router;