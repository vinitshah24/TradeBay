const { body } = require('express-validator');
const { validationResult } = require('express-validator');

// Checks if the user is the author of story
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid Trade Id');
        err.status = 400;
        return next(err);
    }
    else {
        return next();
    }
}

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => { req.flash('error', error.msg); });
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateSignUp = [
    body('firstName', 'Enter Valid non-empty firstName').notEmpty().trim().escape(),
    body('lastName', 'Enter Valid non-empty lastName').notEmpty().trim().escape(),
    body('email', 'Enter Valid Email ID').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 }),
]

exports.validateLogin = [
    body('email', 'Enter Valid Email ID').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 })
]

exports.validateProfileUpdate = [
    body('firstName', 'Enter Valid non-empty firstName').notEmpty().trim().escape(),
    body('lastName', 'Enter Valid non-empty lastName').notEmpty().trim().escape(),
    body('password1', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 }),
    body('password2', 'Confirm Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 }),
]

exports.validateTrade = [
    body('author', 'Trade author cannot be empty').notEmpty().trim().escape(),
    body('category', 'Trade category cannot be empty').notEmpty().trim().escape(),
    body('status', 'Trade status cannot be empty').notEmpty().trim().escape(),
    body('condition', 'Trade condition cannot be empty').notEmpty().trim().escape(),
    body('name', 'Trade name cannot be empty').notEmpty().trim().escape(),
    body('description', 'Trade description must have minimum length of 10 characters').isLength({ min: 10 }).trim().escape()
]
