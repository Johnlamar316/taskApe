const express = require("express");
const passport = require("passport");
const router = express.Router();

//load Profile model
const Profile = require("../../../models/Profile");
// Load input validation
const validateProfileInput = require("../../../validation/profile");

router.get("/test", (req, res) => res.send('Profile Page'));

// @route   GET api/profile/all
// @desc    GET all profile
// @access  public
router.get("/all", (req, res) => {
    Profile.find().then((profile) => {
        if(!profile) {
            res.json({
                status: false,
                message: "There are no profile available",
            })
        }
        res.json(profile);
    })
        .catch((err) =>
            res.status(404).json({status:404, message: "No profile"})
        )
})

// @route   GET api/profile/user/:user_id
// @desc    GET profile by user ID
// @access  public
router.get("/user/:user_id", (req, res) => {
    Profile.findOne({ user: req.params.user_id })
        .then(profile => {
            if(!profile) {
                return res.status(404).json({
                    status: false,
                    message: "There is no profile for this user",
                });
            }
            else {
                res.json(profile);
            }
        })
        .catch(err => {
            res.status(404).json({ status: false, message: "This user profile does not exist" })
        })
})

// @route   GET api/profile
// @desc    GET current user profile
// @access  private
router.get("/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
    Profile.findOne({user:req.user.id})
        .then((profile) => {
            if(!profile) {
                return res.status(404).json({
                    status: false,
                    message: "There is no profile for this current user",
                });
            } else {
                res.json(profile);
            }
        })
        .catch((err) => {
            res.status(404).json({ status: false, message: "This current user profile does not exist" })
        })
    }
    )

// @route   POST api/profile
// @desc    POST create or edit user profile
// @access  private
router.post("/",
    passport.authenticate("jwt", { session: false }),
    (req,res) => {
        const { getErrors, isValid } = validateProfileInput(req.body);
        //check validation
        if (!isValid) {
            return res.status(400).json(getErrors);
        }
        //Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        //social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

        Profile.findOne({user: req.user.id})
            .then((profile) => {
                if(profile) {
                    //update
                    Profile.findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true }
                    ).then(profile => res.json(profile));
                } else {
                    new Profile(profileFields).save()
                        .then(profile => res.json({
                            _meta: {
                                status: true,
                                message: "Profile created successfully"
                            },
                            profile
                        }));
                }
            })
    }
    )

// @route   DELETE api/profile
// @desc    delete user and profile
// @access  private
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOneAndRemove({ user: req.user.id })
            .then(() => {
                res.json({
                    success: true,
                    message: "profile deleted"
                })
            });
    }
);

module.exports = router;