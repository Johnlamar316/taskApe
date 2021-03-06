const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    text: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "users" // users mongoose model from USER model
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "users" // users mongoose model from USER model
            },
            text: {
                type: String,
                required: true
            },
            username: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports  = mongoose.model("post", PostSchema);