const express = require("express");
const passport = require("passport");
const router = express.Router();

//Load input validation
const validatePostInput = require("../../../validation/post");

//load Post Models
const Post = require("../../../Models/Post");
//load Profile model
const Profile = require("../../../models/Profile");

router.get('/test', (req, res) => res.send('Posts Page'));

// @route   GET api/posts
// @desc    get posts
// @access  private
router.get("/", passport.authenticate("jwt", {session: false}),
    (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json({data: posts}))
        .catch(err => res.status(404).json({ status: false, message: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    get a single post by id
// @access  private
router.get("/:id",  passport.authenticate("jwt", {session: false}),
    (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            res.json({data: post})
        })
        .catch(err => res.status(404).json({ status: false, message: "No post found with that iD" }))
});

// @route   POST api/posts
// @desc    create post
// @access  private
router.post("/", passport.authenticate("jwt", {session: false}),
    (req, res) => {
        // bringing data from input validation using destructuring
        const { getErrors, isValid } = validatePostInput(req.body);
        if (!isValid) { //it will turn false cus there is an error string there from register  validation
            //check validation
            return res.status(400).json(getErrors);
        }
        const newPost = new Post({
            text: req.body.text,
            username: req.body.username,
            avatar: req.body.avatar,
            user: req.user.id
        });
        newPost.save().then(post => res.json({
            data: post
        })); //save()
})

// @route   DELETE api/posts/:id
// @desc    delete post
// @access  private
router.delete("/:id", passport.authenticate("jwt", { session: false }),
    (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({status: false, unauthorized: "User not authorized" });
                    }
                    //Delete
                    post.remove().then(post => res.json({
                        _meta : {
                            status: true,
                            message: "Post deleted successfully",
                        },
                        data: req.params.id,
                    })); //remove()
                })
                .catch(err => res.status(400).json({ status: false, message: "Post not found" }));
        })
})

// @route   POST api/posts/like/:id
// @desc    like post
// @access  private
router.post("/like/:id", passport.authenticate("jwt", { session: false }),
    (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //condition of likes
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({
                            status: false,
                            message: "User already liked this post"
                        });
                    }
                    //Add user id to the likes array
                    post.likes.unshift({
                        user: req.user.id
                    });
                    post.save().then(post => res.json({
                        data: post
                    }));
                }).catch(err => res.status(404).json({ status: false, message: "No post found" }))
        })
})

// @route   POST api/posts/unlike/:id
// @desc    dislike post
// @access  private
router.post("unlike/:id", passport.authenticate("jwt", { session: false }),
    (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res
                            .status(400)
                            .json({
                                status: false,
                                message: "You have not yet liked this post"
                            });
                    }
                    //remove user id from the likes array
                    //get a remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);
                    post.likes.splice(removeIndex, 1);
                    post.save().then(post => res.json({
                        data:post
                    }));
                }).catch(err => res.status(404).json({ status: false, message: "No post found" }))
        })
})

// @route   POST api/posts/comments/:id
// @desc    add comments to post
// @access  private
router.post(
    "/comments/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // bringing data from input validation using destructuring
        const { getErrors, isValid } = validatePostInput(req.body);
        if (!isValid) { //it will turn false cus there is an error string there from register  validation
            //check validation
            return res.status(400).json(getErrors);
        }
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        const newComment = {
                            user: req.user.id,
                            text: req.body.text,
                            username: req.body.username,
                            avatar: req.body.avatar
                        };
                        //add to comments array
                        post.comments.unshift(newComment);
                        post.save()
                            .then(post => res.json({
                                data: post
                            }))
                            .catch(err => res.status(404).json({ status: false, message: "no post found" }));
                    });
            });
    }
    );

// @route   DELETE api/posts/comments/:id/:comment_id
// @desc    remove comments to post
// @access  private
router.delete(
    "/comments/:id/:commentId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check to see if the comments exist
                    if (post.comments.filter(comment => comment._id.toString() === req.params.commentId).length === 0) {
                        return res.status(404).json({
                            status: true,
                            message: "comments doesn't exist"
                        });
                    }
                    //get remove index
                    const removeIndex = post.comments
                        .map(item => item._id.toString())
                        .indexOf(req.params.comment_id);

                    //using splice to remove
                    post.comments.splice(removeIndex, 1);

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ status: false, message: "no post found" }));
        });
    }
);

module.exports = router;