const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express()

// body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//router
const users = require("./router/apis/users");
const profile = require("./router/apis/profile");
const todos = require("./router/apis/todos");
const posts = require("./router/apis/posts");

//database config
const db = require("./config/keys").mongoURI;
//connect to mongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log("Database Connected"))
    .catch(err => console.log(err));

//import routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/todos", todos);
app.use("/api/posts", posts);

const port = process.env.PORT || 3011;
app.listen(port, () => console.log(`server running on PORT:/${port}`));
