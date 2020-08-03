const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const gravatar = require("gravatar");
const nodemailer = require("nodemailer");
const crypto = require("crypto");  //crypto is a part of node
const router = express.Router();

//Load input validation
const validateRegisterInput = require("../../../validation/register");
const validateLoginInput = require("../../../validation/login");

//load User model
const User = require("../../../models/Users");

//import secreat keys
const secrets = require("../../../config/keys").secretOrKey;

//import gmail auth password
const GMAILPW = require("../../../config/keys").gmailPW;

//test route
router.get("/test", (req, res) => res.send('Users Page'));

// @route   POST api/users/register
//@desc     Register user route
//@access   Public
router.post("/register", (req,res) => {
    // bringing data from input validation using destructuring
    const { getErrors, isValid } = validateRegisterInput(req.body);
    if(!isValid) {  //it will turn false cus there is an error string there from register  validation
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
router.post("/login", (req,res) => {
    const { getErrors, isValid } = validateLoginInput(req.body);
    //check validation
    if (!isValid) {   //it will turn false cus there is an error string there from login  validation
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
                jwt.sign(payload, secrets, {expiresIn: 3600}, (err, token) => {
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
    });
});

// @route   GET api/users/current
//@desc    return current user
//@access   Private
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
        });
    }
);

// @route   POST api/users/reset-password
//@desc     reset password
//@access   public
router.post("/reset-password", (req, res) => {
    // bringing data from input validation using destructuring
    const { getErrors, isValid } = validateRegisterInput(req.body);
    if(!isValid) {  //it will turn false cus there is an error string there from register  validation
        //check validation
        return res.status(400).json(getErrors);
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "No account with that email address exists.",
                });
            }else {
                const token = crypto.randomBytes(20).toString("hex");
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save().
                then((user) => console.log("user......", user));

                let smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "exceptionaljohnell41@gmail.com",
                        pass: GMAILPW,
                    },
                })

                const mailOptions = {
                    to: user.email,
                    from: "exceptionaljohnell41@gmail.com",
                    subject: "Password Reset Request (TASKAPE)",
                    text:
                        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                        "http://" + req.headers.host + "/api/users/reset/" + token + "\n\n" +
                        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
                };

                smtpTransport.sendMail(mailOptions, (err, response) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({
                            _meta: {
                                status: true,
                                message: `An e-mail has been sent to ${user.email}`,
                                token: "bearer " + token,
                            },
                            data: {
                                username: user.username,
                                avatar: user.avatar,
                                email: user.email
                            }
                        });
                        console.log("response>>>>>", response);
                    }
                });
            }
        })
        .catch((err) => console.log(err));
})

// @route   GET api/users/reset-password/:token
//@desc     update password
//@access   public
router.get("/reset/:token", (req, res) => {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
    }).then((user) => {
        if(!user) {
            return res.status(400).json({
                status: false,
                message: "Password reset token is invalid or has expired.",
            });
        }
        console.log(true);
    })
});

// @route   POST api/users/reset-password/:token
//@desc     update password
//@access   public
router.post("/reset/:token", (req, res) => {
    // bringing data from input validation using destructuring
    const { getErrors, isValid } = validateRegisterInput(req.body);
    if(!isValid) {  //it will turn false cus there is an error string there from register  validation
        //check validation
        return res.status(400).json(getErrors);
    }

    console.log("params token and body******", req.params.token, req.body);
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
    })
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "Password reset token is invalid or has expired.",
                });
            } else {
                if (req.body.password === req.body.password2) {
                    //hashing the password with bcrypt
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if (err) throw err;
                            user.password = hash;
                            user.resetPasswordToken = null;
                            user.resetPasswordExpires = null;
                            user.save()
                            .then((user) => {
                                let smtpTransport = nodemailer.createTransport({
                                    service: "Gmail",
                                    auth: {
                                        user: "exceptionaljohnell41@gmail.com",
                                        pass: GMAILPW,
                                    },
                                });

                                const mailOptions = {
                                    to: user.email,
                                    from: "exceptionaljohnell41@gmail.com",
                                    subject: "Your password has been changed (TASKAPE)",
                                    text:
                                        "Hello,\n\n" +
                                        "This is a confirmation that the password for your account " +
                                        user.email +
                                        " has just been changed.\n",
                                };

                                smtpTransport.sendMail(mailOptions, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({
                                            _meta: {
                                                status: true,
                                                message: "Password updated successfully",
                                            },
                                        });
                                        console.log(result);
                                    }
                                });
                            })
                        })
                    })
                }
            }
        })
})


module.exports = router;