const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const passport = require("passport");
// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(
        new LocalStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { msg: "Incorrect username" });
                }
                if (user.password !== password) {
                    return done(null, false, { msg: "Incorrect password" });
                }
                return done(null, user);
            });
        })
    );
};