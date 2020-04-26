var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const auth_controller = require('../controllers/authentication');
const passport = require("passport");


router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(res.locals.currentUser.username);
    res.render('index', { user: req.user  });
});

router.get('/signup', auth_controller.load_signup);

router.post('/signup', [
    check('username').isLength({ min: 3 }),
    check('password').isLength({ min: 3 })
], auth_controller.signup);

router.get('/login', auth_controller.load_login);


router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signup"
  }));



router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});




module.exports = router;