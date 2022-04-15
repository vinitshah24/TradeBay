const model = require("../models/trade")
const tradeRequestModel = require("../models/tradeRequest")

// GET: /trades - send all trades
exports.index = (req, res, next) => {
    model.find()
        .then(trades => {
            output = {}
            uniqueCategories = []
            for (var i = 0; i < trades.length; i++) {
                if (uniqueCategories.includes(trades[i].category) === false) {
                    uniqueCategories.push(trades[i].category)
                }
            }
            output.categories = uniqueCategories
            output.items = trades
            res.render("./trade/index", { title: "Trades", trades: output })
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
};

// GET: /trades/new - send html form for creating new trade
exports.new = (req, res) => {
    res.render("./trade/new", { title: "Create Trade" })
};

// GET: /trades/:id - get trade for id
exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('author', 'firstName lastName')
        .then(trade => {
            if (trade) {
                let id = req.session.user;
                res.render("./trade/show", { title: "Trade", trade: trade, user_id: id })
            } else {
                let err = new Error("Cannot find the trade with id " + id);
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
};

// POST: /trades - create new trade
exports.create = (req, res, next) => {
    let trade = new model(req.body);
    trade.author = req.session.user;
    try {
        trade.image = req.file.filename;
    }
    catch (exception) {
        let err = new Error("Trade image is missing");
        err.status = 404;
        next(err);
    }
    trade.save()
        .then((trade) => {
            req.flash("success", "New Trade added successfully!")
            res.redirect("/trades")
        }
        )
        .catch(err => {
            if (err.name === "ValidationError") {
                err.status = 404;
            }
            next(err)
        });
}

// GET: /trades/:id/edit - send form for editing existing trade
exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
        .then(trade => {
            if (trade) {
                return res.render("./trade/edit", { title: "Trade", trade: trade });
            }
            else {
                let err = new Error("Cannot find the trade with id " + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
};

// PUT: /trades/:id - update the trade for id
exports.update = (req, res, next) => {
    let trade = req.body;
    if (req.file !== undefined) {
        trade.image = req.file.filename;
    }
    trade.author = req.session.user;
    let id = req.params.id;
    model.findByIdAndUpdate(id, trade, { useFindAndModify: false, runValidators: true })
        .then(trade => {
            if (trade) {
                req.flash("success", "Trade: " + id + " updated successfully!")
                res.redirect("/trades/" + id)
            }
            else {
                let err = new Error("Cannot find the trade with id " + id);
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
};

// DELETE: /trades/:id - delete the trade with id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    Promise.all([
        model.findByIdAndDelete(id, { runValidators: true }),
        tradeRequestModel.deleteMany({ trade: id }),
        tradeRequestModel.deleteMany({ trade_offer: id })
    ])
        .then(trade => {
            if (trade) {
                req.flash("success", "Trade " + id + " deleted successfully!")
                res.redirect("/trades");
            }
            else {
                let err = new Error("Cannot find the trade with id " + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
};

exports.rate = (req, res, next) => {
    let trade_id = req.body.trade;
    user = req.session.user;
    model.findById(trade_id)
        .then(trade => {
            if (trade) {
                let foundRatings = trade.ratings
                if (foundRatings.includes(user)) {
                    req.flash("error", "You have already rated the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
                else {
                    model.findOneAndUpdate(
                        { _id: trade_id },
                        { $push: { ratings: user } },
                        { useFindAndModify: false, runValidators: true })
                        .then(trade => {
                            if (trade) {
                                req.flash("success",
                                    "You have successfully liked the trade id " + trade_id + "!")
                                res.redirect("/trades");
                            }
                            else {
                                let err = new Error("Cannot find the trade id " + trade_id);
                                err.status = 404;
                                next(err);
                            }
                        })
                        .catch(err => next(err))
                    req.flash("success", "You have successfully rated the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
            }
            else {
                let err = new Error("Cannot find the trade with id " + trade_id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
};

exports.rate = (req, res, next) => {
    let trade_id = req.body.trade;
    user = req.session.user;
    model.findById(trade_id)
        .then(trade => {
            if (trade) {
                let foundRatings = trade.ratings
                if (foundRatings.includes(user)) {
                    req.flash("error", "You have already rated the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
                else {
                    model.findOneAndUpdate(
                        { _id: trade_id },
                        { $push: { ratings: user } },
                        { useFindAndModify: false, runValidators: true })
                        .then(trade => {
                            if (trade) {
                                req.flash("success",
                                    "You have successfully liked the trade id " + trade_id + "!")
                                res.redirect("/trades");
                            }
                            else {
                                let err = new Error("Cannot find the trade id " + trade_id);
                                err.status = 404;
                                next(err);
                            }
                        })
                        .catch(err => next(err))
                    req.flash("success", "You have successfully rated the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
            }
            else {
                let err = new Error("Cannot find the trade with id " + trade_id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
};

exports.rate = (req, res, next) => {
    let trade_id = req.body.trade;
    user = req.session.user;
    model.findById(trade_id)
        .then(trade => {
            if (trade) {
                let foundRatings = trade.ratings
                if (foundRatings.includes(user)) {
                    req.flash("error", "You have already rated the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
                else {
                    model.findOneAndUpdate(
                        { _id: trade_id },
                        { $push: { ratings: user } },
                        { useFindAndModify: false, runValidators: true })
                        .then(trade => {
                            if (trade) {
                                req.flash("success",
                                    "You have successfully liked the trade id " + trade_id + "!")
                                res.redirect("/trades");
                            }
                            else {
                                let err = new Error("Cannot find the trade id " + trade_id);
                                err.status = 404;
                                next(err);
                            }
                        })
                        .catch(err => next(err))
                    req.flash("success", "You have successfully rated the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
            }
            else {
                let err = new Error("Cannot find the trade with id " + trade_id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
};

exports.like = (req, res, next) => {
    let trade_id = req.body.trade;
    user = req.session.user;
    model.findById(trade_id)
        .then(trade => {
            if (trade) {
                let foundRatings = trade.ratings
                if (foundRatings.includes(user)) {
                    req.flash("error", "You have already rated the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
                else {
                    model.findOneAndUpdate(
                        { _id: trade_id },
                        { $push: { ratings: user } },
                        { useFindAndModify: false, runValidators: true })
                        .then(trade => {
                            if (trade) {
                                req.flash("success",
                                    "You have successfully liked the trade id " + trade_id + "!")
                                res.redirect("/trades");
                            }
                            else {
                                let err = new Error("Cannot find the trade id " + trade_id);
                                err.status = 404;
                                next(err);
                            }
                        })
                        .catch(err => next(err))
                    req.flash("success", "You have successfully rated the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
            }
            else {
                let err = new Error("Cannot find the trade with id " + trade_id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
};

exports.dislike = (req, res, next) => {
    let trade_id = req.body.trade;
    user = req.session.user;
    model.findById(trade_id)
        .then(trade => {
            if (trade) {
                let foundRatings = trade.ratings
                if (!foundRatings.includes(user)) {
                    req.flash("error", "You have not rated the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
                else {
                    model.findByIdAndUpdate(
                        { _id: trade_id },
                        { $pull: { ratings: user } },
                        { safe: true, upsert: true })
                        .then(trade => {
                            if (trade) {
                                req.flash("success",
                                    "You have successfully disliked the trade id " + trade_id + "!")
                                res.redirect("/trades");
                            }
                            else {
                                let err = new Error("Cannot find the trade id " + trade_id);
                                err.status = 404;
                                next(err);
                            }
                        })
                        .catch(err => next(err))
                    req.flash("success", "You have successfully disliked the Trade!")
                    res.redirect("/trades/" + trade_id);
                }
            }
            else {
                let err = new Error("Cannot find the trade with id " + trade_id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            // next(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
};

exports.swap = (req, res) => {
    let id = req.params.id;
    let user_id = req.session.user;
    model.findById(id).populate('author', 'firstName lastName')
        .then(trade => {
            if (trade) {
                model.find().populate('author', 'firstName lastName')
                    .where('author').equals(user_id)
                    .then(user_trades => {
                        res.render("./trade/swap", {
                            title: "Initiate Trade",
                            swap_trade: trade,
                            user_trades: user_trades
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash("error", "Internal Server Error occurred while processing the request!")
                        redirect('back')
                    })
            } else {
                let err = new Error("Cannot find the trade with id " + id);
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
};

exports.initiateRequest = (req, res) => {
    let user_id = req.session.user;
    let want_trade = req.body.want_trade;
    let want_trade_author = req.body.want_trade_author;
    let swap_trade = req.body.swap_trade;
    let tradeReq = {
        trade: want_trade,
        owner: want_trade_author,
        requester: user_id,
        trade_offer: swap_trade,
    }
    tradeRequestModel.findOne({ trade: want_trade, owner: want_trade_author, trade_offer: swap_trade })
        .then((trade) => {
            if (trade) {
                req.flash("error", "Trade Request already sent!")
                res.redirect("/trades")
            }
            else {
                let tradeRequest = new tradeRequestModel(tradeReq);
                tradeRequest.save()
                    .then((trade) => {
                        req.flash("success", "Trade Request sent successfully!")
                        res.redirect("/trades")
                    }
                    )
                    .catch(err => {
                        if (err.name === "ValidationError") {
                            err.status = 404;
                        }
                        next(err)
                    });
            }
        }
        )
        .catch(err => {
            if (err.name === "ValidationError") {
                err.status = 404;
            }
            next(err)
        });
}

exports.postTradeRequest = (req, res) => {
    let trade_req_id = req.body.trade_req_id;
    let trade_id = req.body.trade_id;
    let owner_id = req.body.owner_id;
    let trade_offer_id = req.body.trade_offer_id;
    let req_id = req.body.req_id;
    let decision = req.body.decision;
    if (decision.toLowerCase() === "approve") {
        model.findOneAndUpdate({ _id: trade_id }, { author: trade_req_id })
            .then(a => {
                model.findOneAndUpdate({ _id: trade_offer_id }, { author: owner_id })
                    .then(tradeReq => {
                        tradeRequestModel.deleteMany({ trade_offer: trade_offer_id })
                            .then(tradeReq => {
                                tradeRequestModel.deleteMany({ trade: trade_id })
                                    .then(tr => {
                                        req.flash("success", "Trade Swapped successfully!")
                                        res.redirect("/users/profile")
                                    })
                                    .catch(err => {
                                        req.flash("error", "Internal Server Error occurred while processing the request!")
                                        redirect('back')
                                    })
                            })
                            .catch(err => {
                                req.flash("error", "Internal Server Error occurred while processing the request!")
                                redirect('back')
                            })
                    })
                    .catch(err => {
                        req.flash("error", "Internal Server Error occurred while processing the request!")
                        redirect('back')
                    })
            })
            .catch(err => {
                req.flash("error", "Internal Server Error occurred while processing the request!")
                redirect('back')
            })
    } else {
        tradeRequestModel.findByIdAndDelete(req_id, { runValidators: true })
            .then(tr => {
                req.flash("success", "Trade declined successfully!")
                res.redirect("/users/profile")
            })
            .catch(err => {
                req.flash("error", "Internal Server Error occurred while processing the request!")
                redirect('back')
            })
    }
}