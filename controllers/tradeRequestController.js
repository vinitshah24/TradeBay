const User = require('../models/user');
const Trade = require('../models/trade');
const tradeRequestModel = require("../models/tradeRequest")

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
        is_accepted: false
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

exports.getSentRequest = (req, res) => {
    let user_id = req.session.user;
    tradeRequestModel.find({})
        .where('requester').equals(user_id)
        .populate("trade requester trade_offer")
        .then(tradeReq => {
            res.render("./trade/sentreq", { title: "Sent Requests", tradeReq: tradeReq })
        })
        .catch(err => {
            console.log(err)
            req.flash("error", "Internal Server Error occurred while processing the request!")
            // redirect('back')
        })
}

exports.getReceivedRequest = (req, res) => {
    let user_id = req.session.user;
    tradeRequestModel.find({})
        .where('owner').equals(user_id)
        .populate("trade requester owner trade_offer")
        .then(tradeReq => {
            // console.log("tradeReq: " + tradeReq)
            res.render("./trade/recreq", { title: "Received Requests", tradeReq: tradeReq })
        })
        .catch(err => {
            req.flash("error", "Internal Server Error occurred while processing the request!")
            redirect('back')
        })
}

exports.postTradeRequest = (req, res) => {
    let trade_req_id = req.body.trade_req_id;
    let trade_id = req.body.trade_id;
    let owner_id = req.body.owner_id;
    let trade_offer_id = req.body.trade_offer_id;

    let decision = req.body.decision;
    if (decision.toLowerCase() === "approve") {
        console.log(trade_id + " ==== " + trade_req_id)
        Trade.findOneAndUpdate({ _id: trade_id }, { author: trade_req_id })
            .then(a => {
                console.log(trade_offer_id + " ==== " + owner_id)
                Trade.findOneAndUpdate({ _id: trade_offer_id }, { author: owner_id })
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

    }

}