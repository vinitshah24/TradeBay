const model = require("../models/trade")

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
        .catch(err => next(err))
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
                console.log("Found session ID: " + id)
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
        .catch(err => next(err))
};

// PUT: /trades/:id - update the trade for id
exports.update = (req, res, next) => {
    let trade = req.body;
    if (req.file !== undefined) {
        trade.image = req.file.filename;
    }
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
    model.findByIdAndDelete(id, { runValidators: true })
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
        .catch(err => next(err))
};