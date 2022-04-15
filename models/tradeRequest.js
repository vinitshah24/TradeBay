const mongoose = require("mongoose");
const Schema = mongoose.Schema

const tradeRequestSchema = new Schema({
    trade: {
        type: Schema.Types.ObjectId,
        ref: 'Trade'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    trade_offer: {
        type: Schema.Types.ObjectId,
        ref: 'Trade'
    }
})

module.exports = mongoose.model("TradeRequest", tradeRequestSchema);