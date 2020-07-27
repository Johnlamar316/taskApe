const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const todoSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    motivation: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Pending",
    },
    date: {
        type: Date,
        default: Date.now,
    },

    tasks: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "user",
            },
            description: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

module.exports = mongoose.model("todo", todoSchema);
