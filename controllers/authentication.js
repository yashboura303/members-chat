const { validationResult } = require('express-validator');
const user = require('../models/user.js');
exports.load_signup = (req, res, next) => {
    res.render('signup');
};

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const new_user = await new user({
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullname
    }).save(err => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

exports.load_login = (req, res, next) => {
    res.render('login');
};

// exports.login = (req, res, next) => {
    // res.render('login');
// };
