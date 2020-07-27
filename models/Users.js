const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});

module.exports = mongoose.model("user", UserSchema);