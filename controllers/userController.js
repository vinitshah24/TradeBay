const User = require('../models/user');
const Trade = require('../models/trade');
const tradeRequestModel = require("../models/tradeRequest")

exports.getSignup = (req, res) => {
    res.render('./user/signup', { title: "Signup" });
}

exports.postSignup = (req, res, next) => {
    let password1 = req.body.password;
    let password2 = req.body.password2;
    if (password1 !== password2) {
        req.flash('error', 'Password and confirm password not matched!');
        return res.redirect('/users/signup')
    } else {
        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
        if (user.email) {
            user.email = user.email.toLowerCase();
        }
        user.save()
            .then(usr => {
                req.flash('success', 'Account created successfully!');
                res.redirect('/users/login')
            })
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
}

exports.getLogin = (req, res) => {
    res.render('./user/login', { title: "Login" });
}

exports.postLogin = (req, res, next) => {
    let email = req.body.email;
    if (email) {
        email = email.toLowerCase();
    }
    let password = req.body.password;
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
                    .catch(err => {
                        // next(err)
                        req.flash("error", "Internal Server Error occurred while processing the request!")
                        redirect('back')
                    })
            }
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
}

exports.getProfile = (req, res) => {
    let id = req.session.user;
    Promise.all([
        User.findById(id),
        Trade.find({ author: id }),
        tradeRequestModel.find({}).where('requester').equals(id).populate("trade requester trade_offer"),
        tradeRequestModel.find({ owner: id, status: "waiting" }).populate("trade requester owner trade_offer")
    ])
        .then(results => {
            const [user, trades, tradeReq, tradeRes] = results;
            res.render('./user/profile', { title: "Profile", user, trades, tradeReq, tradeRes })
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        });
}

exports.getUpdateProfile = (req, res) => {
    let id = req.session.user;
    User.findById(id)
        .then(user => {
            res.render('./user/update', { title: "Update Profile", user });
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        });
}

exports.postUpdateProfile = (req, res) => {
    let id = req.session.user;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let password1 = req.body.password1;
    let password2 = req.body.password2;
    if (password1 !== password2) {
        req.flash("error", "Your password confirmation does not match!")
        return res.redirect('/users/update')
    }
    else {
        let updatedUser = {
            firstName: firstName,
            lastName: lastName,
            password: password1
        }
        User.findByIdAndUpdate(id, updatedUser, { useFindAndModify: false, runValidators: true })
            .then(usr => {
                if (usr) {
                    usr.password = password1;
                    usr.save()
                        .then(usr => {
                            req.flash("success", "Your profile is updated successfully!")
                            res.redirect('/users/profile')
                        })
                        .catch(err => {
                            if (err.name === "ValidationError") {
                                req.flash("error", err.message);
                                return res.redirect("/users/signup");
                            }
                            next(err);
                        });
                }
                else {
                    let err = new Error("Error occurred while updating profile");
                    err.status = 404;
                    next(err);
                }
            })
            .catch(err => {
                if (err.name === "ValidationError") {
                    err.status = 400;
                }
                next(err);
            });
    }
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