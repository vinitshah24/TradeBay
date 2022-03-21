const User = require('../models/user');
const Trade = require('../models/trade');

exports.getSignup = (req, res) => {
    res.render('./user/signup', { title: "Signup" });
}

exports.postSignup = (req, res, next) => {
    let user = new User(req.body);
    console.log("USER SIGNUP: " + user)
    user.save()
        .then(() => res.redirect('/users/login'))
        .catch(err => {
            if (err.name === "ValidationError") {
                req.flash("error", err.message);
                return res.redirect("/users/signup");
            }
            if (err.code === 11000) {
                req.flash("error", "Email is already used!");
                return res.redirect("/users/signup");
            }
            next(err);
        });
}

exports.getLogin = (req, res) => {
    res.render('./user/login', { title: "Login" });
}

exports.postLogin = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    // console.log(req.flash())
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash("error", "Incorrect Email!")
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.flash("success", "Login Successful!");
                            res.redirect('/users/profile')
                        }
                        else {
                            req.flash("error", "Incorrect Password")
                            res.redirect('/users/login')
                        }
                    })
                    .catch(err => next(err))
            }
        })
        .catch(err => next(err))
}

exports.getProfile = (req, res) => {
    let id = req.session.user;
    Promise.all([User.findById(id), Trade.find({ author: id })])
        .then(results => {
            console.log(results)
            const [user, trades] = results;
            res.render('./user/profile', { title: "Profile", user, trades })
        })
        .catch(err => next(err));
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        else {
            res.redirect('/');
        }
    })
}