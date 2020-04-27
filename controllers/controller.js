const Message = require('../models/messages.js');
const User = require('../models/user.js');
const moment = require('moment');
exports.show_message_form = (req, res, next) => {
    res.render('message');
};

exports.submit_message = async (req, res, next) => {

    try {
        const message = await new Message({
            title: req.body.title,
            message: req.body.message,
            user: req.user._id
        }).save(err => {
            if (err) {
                res.status(500).send(err);
                return next(err);
            }
            res.redirect("/");
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.home_page = async (req, res, next) => {
	console.log(res.locals.isMember);
    const messages = await Message.find({}).populate('user');
    try {
        res.render('index', { messages, user: res.locals.currentUser,moment: moment });
    } catch (err) {
        res.status(500).send(err);
    }

};

exports.show_member_form = (req, res, next) => {
    res.render('makeMember');
};

exports.check_member_code = async (req, res, next) => {
    if (req.body.memberPassword == "member") {
        try {
            const user = await User.findByIdAndUpdate(req.user._id, { $set: { isMember: true } });
        } catch (err) {
            res.status(500).send(err);
        }
    }
    if (req.body.memberPassword=="true") {
        try {

            const user = await User.findByIdAndUpdate(req.user._id, { $set: { isAdmin: true } });
        } catch (err) {
            res.status(500).send(err);
        }
    }
    res.redirect('/');
};

exports.delete_message = async (req, res, next) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) res.status(404).send("No item found");
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err);
    }
};