const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const ProfileSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    githubusername: {
        type: String
    },
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("profile", ProfileSchema);