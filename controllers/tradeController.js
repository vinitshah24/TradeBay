const model = require("../models/trade")

// GET: /trades - send all trades
exports.index = (req, res) => {
    // res.send("Send all trades");
    // res.send(model.find())
    let trades = model.find()
    res.render("./trade/index", { title: "Trades", trades: trades })

};

// GET: /trades/new - send html form for creating new trade
exports.new = (req, res) => {
    // res.send("Send new trade form");
    res.render("./trade/new", { title: "Create Trade" })
};

// GET: /trades/:id - get trade for id
exports.show = (req, res, next) => {
    // res.send("Send trade for ID: " + req.params.id);
    let id = req.params.id;
    let trade = model.findById(id);
    // res.send(trade);
    if (trade) {
        res.render("./trade/show", { title: "Trade", trade: trade })
    } else {
        // res.status(404).send("Cannot find the trade with id " + req.params.id)
        let err = new Error("Cannot find the trade with id " + id);
        err.status = 404;
        next(err);
    }
};

// POST: /trades - create new trade
exports.create = (req, res) => {
    // res.send("Created new trade");
    // console.log(req.body);
    // let trade = req.body;
    // model.save(trade);
    // res.redirect("/trades");
    const reqData = JSON.parse(JSON.stringify(req.body));
    // console.log(reqData);
    // console.log(req.file);
    reqData.image = req.file.filename;
    // console.log(reqData);
    model.save(reqData);
    res.redirect("/trades");
}


// GET: /trades/:id/edit - send form for editing existing trade
exports.edit = (req, res, next) => {
    // res.send("Send the edit form for ID: " + req.params.id);
    let id = req.params.id;
    let trade = model.findById(id);
    if (trade) {
        // console.log({ title: "Trade", trade: trade })
        res.render("./trade/edit", { title: "Trade", trade: trade })
    }
    else {
        // res.status(404).send("Cannot find the trade with id " + req.params.id)
        let err = new Error("Cannot find the trade with id " + id);
        err.status = 404;
        next(err);
    }
};

// PUT: /trades/:id - update the trade for id
exports.update = (req, res, next) => {
    // res.send("Update the trade with ID: " + req.params.id);
    let trade = req.body;
    if (req.file !== undefined) {
        trade.image = req.file.filename;
    }
    let id = req.params.id;
    // console.log("req.file.filename " + req.file)
    if (model.updateById(id, trade)) {
        res.redirect("/trades/" + id)
    }
    else {
        // res.status(404).send("Cannot find the trade with id " + req.params.id)
        let err = new Error("Cannot find the trade with id " + id);
        err.status = 404;
        next(err);
    }
};

// DELETE: /trades/:id - delete the trade with id
exports.delete = (req, res, next) => {
    // res.send("Delete the trade with ID: " + req.params.id);
    let id = req.params.id;
    if (model.deleteById(id)) {
        res.redirect("/trades")
    } else {
        // res.status(404).send("Cannot find the trade with id " + id)
        let err = new Error("Cannot find the trade with id " + id);
        err.status = 404;
        next(err);
    }
};