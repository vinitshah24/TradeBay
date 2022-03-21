const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');

const router = express.Router();

router.get('/signup', isGuest, controller.getSignup);
router.post('/signup', isGuest, controller.postSignup);

router.get('/login', isGuest, controller.getLogin);
router.post('/login', isGuest, controller.postLogin);

router.get('/profile', isLoggedIn, controller.getProfile);

router.get('/logout', isLoggedIn, controller.getLogout);

module.exports = router;