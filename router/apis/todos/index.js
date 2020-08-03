const express = require("express");
const passport = require("passport");
const router = express.Router();


//load Post model
const Todo = require("../../../models/Todos");
//load User model
const User = require("../../../models/Users");

router.get("/test", (req, res) => res.send('Todo Page'));

// @route   GET api/todos
//@desc     get all private todos
//@access   Private
router.get("/", passport.authenticate("jwt", {session: false}),
    (req, res) => {
    Todo.find()
        .sort({date: -1})     //sort in descending order
        .then((todos) => {
            if(todos) {
                let result = todos.map((todo) => {
                    if(todo.user.toString() === req.user.id){
                        return todo;
                    }
                });
                return res.json({
                    data: result.filter((val) => val !== undefined)
                });
            }
            res.status(404).json({
                status: false,
                message: "There are no todos for this User"
            });
        }).catch((err) => res.status(404).json())
    })

// @route   GET api/todos/:id
//@desc     get a single todo by id
//@access   Private
router.get("/:id", (req, res) => {
    Todo.findById(req.params.id)
        .then((todo) => {
            res.json({data: todo})
        })
        .catch((err) =>
            res.status(404).json({status:404, message: "Todo does not exist"})
        )
})

// @route   GET api/todos/all/all
// @desc    GET all todo
// @access  public
router.get("/all/all", (req, res) => {
    Todo.find()
        .then(todo => {
            if (!todo) {
                return res.status(404).json({
                    status: false,
                    message: "There are no todos available",
                });
            }
            res.json(todo);
        })
        .catch(err => res.status(404).json({
            status: false,
            message: "no todos for you",
        }));
});

// @route   POST apis/todos
//@desc     create todo
//@access   Private
router.post("/", passport.authenticate("jwt", {session: false}),
    (req, res) => {
    const newTodo = new Todo({
            title: req.body.title,
            description: req.body.description,
            motivation: req.body.motivation,
            user: req.user.id,
            avatar: req.user.avatar
    });
    //new todo created
        newTodo.save().then((todo) => {
            res.json({
                _meta:{
                    status: true,
                    message: "Todo created successfully"
                },
                data: todo
            })
        })
    })


// @route   PUT apis/todos/status
//@desc     add status to todo
//@access   Private
router.put("/:id/status", passport.authenticate("jwt", { session: false }),
    (req, res) => {
    Todo.findById(req.params.id).
        then((todo) => {
        if (todo) {
            todo.status = req.body.status;
            todo.save().then((todo) =>
                res.json({
                    _meta: {
                        status: true,
                        message: `Todo status updated successfully`,
                    },
                    data: todo,
                })
            );
        }
    })
        .catch((err) => {
            res.status(404).json({ status: false, message: "Todo does not exist" })
        })
    });

// @route   DELETE api/todos/:id
//@desc     delete todo
//@access   Private
router.delete("/:id", passport.authenticate("jwt", { session: false }),
    (req, res) => {
    User.findById(req.user.id).then((user) => {
        Todo.findById(req.params.id)
            .then((todo) => {
                if (todo.user.toString() !== req.user.id) {
                    return res
                        .status(401)
                        .json({ status: false, message: "user not authorized" });
                }
                todo.remove().then(() =>
                    res.json({
                        _meta: {
                            status: true,
                            message: "Todo deleted successfully",
                        },
                        data: req.params.id,
                    })
                );
            }).catch((err) => {
            res.status(404).json({ status: false, message: "todo not found" })
        })
    })
    });

// @route   POST apis/todos/tasks/:id
//@desc    add task to todo
//@access   Private
router.post("/tasks/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Todo.findById(req.params.id)
            .then((todo) => {
                const newTask = {
                    description: req.body.description,
                    user: req.user.id,
                };
                //add newTask to the array
                todo.tasks.unshift(newTask);
                //save post
                todo.save().then((task) =>
                    res.json({
                        _meta: {
                            status: true,
                            message: "Task added successfully",
                        },
                        data: task,
                    })
                )
            })
            .catch((err) =>
                res.status(404).json({ status: false, message: "No todo to add tasks" })
            );
    });

// @route   PUT apis/todos/tasks/:todoId/:taskId
//@desc     edit task in todo
//@access   Private
router.put(
    "/tasks/:todoId/:taskId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Todo.findById(req.params.todoId)
            .then((todo) => {if (todo) {
                const initialTodo = todo.tasks.filter((task) => {
                    if (task._id.toString() === req.params.taskId) {
                        return todo.tasks;
                    }
                });
                if (initialTodo.length) {
                    initialTodo[0]["description"] = req.body.description;
                    todo.save().then((todo) =>
                        res.json({
                            _meta: {
                                status: true,
                                message: "Task edited successfully",
                            },
                            data: todo,
                        })
                    );
                } else {
                    return res
                        .status(404)
                        .json({ status: false, message: "no task to edit" });
                }
            } else {
                return res
                    .status(404)
                    .json({ status: false, message: "todo do not exist" });
            }
            })
            .catch((err) =>
                res.status(404).json({ status: false, message: "No todo to add tasks" })
            );
    }
);

// @route   DELETE apis/todos/tasks/:todoId/:taskId
//@desc     delete task from todo
//@access   Private
router.delete("/tasks/:todoId/:taskId", passport.authenticate("jwt", { session: false }),
    (req, res) => {
    Todo.findById(req.params.todoId)
        .then((todo) => {
            if (todo) {
                if (
                    todo.tasks.filter(
                        (task) => task._id.toString() === req.params.taskId
                    ).length
                ) {
                    var removeTask = todo.tasks
                        .map((task) => task.id.toString())
                        .indexOf(req.params.taskId);
                    //remove from array
                    todo.tasks.splice(removeTask, 1);

                    todo.save().then((todo) =>
                        res.json({
                            _meta: {
                                status: true,
                                message: "Task deleted successfully",
                            },
                            data: todo,
                        })
                    );
                } else {
                    return res
                        .status(404)
                        .json({ status: false, message: "no task to delete" });
                }
            }
            else {
                return res
                    .status(404)
                    .json({ status: false, message: "todo do not exist" });
            }
        })
        .catch((err) =>
            res.status(404).json({ postnotfound: "No todo to add tasks" })
        );
    })


module.exports = router;