const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (!validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.username = "Username must be between 2 and 30 characters";
    }
    if (validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    }
    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    return {
        getErrors: errors,
        isValid: isEmpty(errors)
    };
};