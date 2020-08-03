const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
    let errors = {};
    data.company = !isEmpty(data.company) ? data.company : "";

    if (!isEmpty(data.website)) {
        if (!validator.isURL(data.website)) {
            errors.website = "Not a valid URL";
        }
    }

    if (validator.isEmpty(data.company)) {
        errors.company = "Company field is required";
    }

    if (!isEmpty(data.youtube)) {
        if (!validator.isURL(data.youtube)) {
            errors.youtube = "Not a valid URL";
        }
    }

    if (!isEmpty(data.twitter)) {
        if (!validator.isURL(data.twitter)) {
            errors.twitter = "Not a valid URL";
        }
    }

    if (!isEmpty(data.facebook)) {
        if (!validator.isURL(data.facebook)) {
            errors.facebook = "Not a valid URL";
        }
    }

    if (!isEmpty(data.linkedin)) {
        if (!validator.isURL(data.linkedin)) {
            errors.linkedin = "Not a valid URL";
        }
    }

    if (!isEmpty(data.instagram)) {
        if (!validator.isURL(data.instagram)) {
            errors.instagram = "Not a valid URL";
        }
    }

    return {
        getErrors: errors,
        isValid: isEmpty(errors)
    };
};