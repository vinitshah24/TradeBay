const mongoose = require("mongoose");
const Schema = mongoose.Schema

const tradeSchema = new Schema({
    name: {
        type: String,
        required: [true, "Trade name is required"]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        required: [true, "Trade category is required"]
    },
    description: {
        type: String,
        required: [true, "Trade description is required"],
        minLength: [10, "Description should have at least 10 characters"]
    },
    status: {
        type: String,
        required: [true, "Trade status is required"]
    },
    power: {
        type: Number,
        required: [true, "Trade power is required"]
    },
    condition: {
        type: String,
        required: [true, "Trade condition is required"]
    },
    image: {
        type: String,
        required: [true, "Trade image is required"]
    },
    watch_list: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

// Collection name is stories
module.exports = mongoose.model("Trade", tradeSchema);