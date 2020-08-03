const express = require("express");
const passport = require("passport");
const router = express.Router();

//load Post Models
const Post = require("../../../Models/Post");
//load Profile model
const Profile = require("../../../models/Profile");

router.get('/test', (req, res) => res.send('Posts Page'));

// @route   GET api/posts
// @desc    get posts
// @access  public
router.get("/", passport.authenticate("jwt", {session: false}),
    (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json({data: posts}))
        .catch(err => res.status(404).json({ status: false, message: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    get a single post by id
// @access  public
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
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        });
        newPost.save().then(post => res.json({
            data: post
        })); //save()
    }
)

// @route   DELETE api/posts/:id
// @desc    delete post
// @access  private
router.delete("/:id",
    passport.authenticate("jwt", { session: false }),
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


module.exports = router;