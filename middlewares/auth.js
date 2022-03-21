const Trade = require('../models/trade');

// Checks if the user is a guest
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    else {
        req.flash("error", "You are already logged in!")
        return res.redirect('/users/profile');
    }
}

// Checks if the user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    else {
        req.flash("error", "You are not logged in!")
        return res.redirect('/users/login');
    }
}

// Checks if the user is the author of Trade
exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    Trade.findById(id)
        .then(trade => {
            if (trade) {
                if (trade.author == req.session.user) {
                    return next();
                } else {
                    let err = new Error('Unauthorized access to the resource!');
                    err.status = 401;
                    return next(err);
                }
            }
        })
        .catch(err => {
            next(err)
        });
}