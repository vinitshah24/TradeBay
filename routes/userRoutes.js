const express = require('express');
const controller = require('../controllers/userController');
const tradeController = require('../controllers/tradeController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
const { logInLimiter } = require('../middlewares/rateLimiter');
const { validateSignUp, validateLogin, validateProfileUpdate, validateResult } = require('../middlewares/validator');

const router = express.Router();

router.get('/signup', isGuest, controller.getSignup);
router.post('/signup', isGuest, validateSignUp, validateResult, controller.postSignup);
router.get('/login', isGuest, controller.getLogin);
router.post('/login', logInLimiter, isGuest, validateLogin, validateResult, controller.postLogin);
router.get('/profile', isLoggedIn, controller.getProfile);
router.get('/update', isLoggedIn, controller.getUpdateProfile);
router.post('/update', isLoggedIn, validateProfileUpdate, validateResult, controller.postUpdateProfile);

router.get('/watchlist', isLoggedIn, tradeController.getWatchList);
router.get('/logout', isLoggedIn, controller.getLogout);

module.exports = router;