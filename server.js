const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const app = express()

// CORS-enabled web server listening in the same local port
app.use(cors());

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
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log("Database Connected"))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport Config
require("./config/passport")(passport);

//import routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/todos", todos);
app.use("/api/posts", posts);

const port = process.env.PORT || 3011;
app.listen(port, () => console.log(`server running on PORT:/${port}`));
