const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const router = express.Router();

//Load input validation
const validateRegisterInput = require("../../../validation/register");
const validateLoginInput = require("../../../validation/login");

//load User model
const User = require("../../../models/Users");

const secrets = require("../../../config/keys").secretOrKey;

//test route
router.get('/test', (req, res) => res.send('Users Page'));

// @route   POST api/users/register
//@desc     Register user route
//@access   Public
router.post('/register', (req,res) => {
    // bringing data from input validation using destructuring
    const { getErrors, isValid } = validateRegisterInput(req.body);
    if(!isValid) {
        //check validation
        return res.status(400).json(getErrors);
    }

    User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }],
    }).then((user) => {
        if(user) {
            User.findOne({ email: req.body.email }).then((userEmail) => {
                if(userEmail) {
                    res.status(400).json({
                        status: false,
                        message: "email already exists",
                    })
                }else {
                    res.status(400).json({
                        status: false,
                        message: "username already exists",
                    });
                }
            })
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: "200", //size
                r: "pg", //rating
                d: "mm" //default
            });
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                avatar,
                password: req.body.password
            });
            //hashing the password with bcrypt
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err)throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then((user) => res.json({
                            _meta: {
                                status: true,
                                message: "registration successful"
                            },
                            user
                        })
                        ).catch((err) => console.log(err))
                })
            })
        }
    })
})

// @route   POST api/users/login
//@desc    Login user route/ Return JWT Token
//@access   Public
router.post('/login', (req,res) => {
    const { getErrors, isValid } = validateLoginInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json(getErrors);
    }
    const username = req.body.username;
    const password = req.body.password;
    //find user by username
    User.findOne({ username }).then((user) => {
        //check for user
        if (!user) {
            return res.status(404).json({
                status: false,
                message: `User not found`,
            });
        }
        // check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch) {
                //user matched
                // create jwt payload
                const payload = { id: user.id, username: user.username, avatar: user.avatar };
                //sign in Token
                jwt.sign(payload, secrets, {expires: 3600}, (err, token) => {
                    if(err) throw err;
                    res.json({
                        _meta: {
                            status: true,
                            message: `Welcome back ${user.username}`,
                            token: "Bearer " + token //authenticating bearer
                        },
                        data: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            date: user.date,
                        },
                    });
                })
            } else {
                return res.status(400).json({
                    status: false,
                    message: "password not found",
                });
            }
        })
    })
})


module.exports = router;