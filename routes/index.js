var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const auth_controller = require('../controllers/authentication');
const controller = require('../controllers/controller');
const passport = require("passport");



// function setMemberLocal(req, res, next) {
//   if (req.isAuthenticated()) {
//     res.locals.isMember = req.user.isMember;
//     next();
//   }
//   else {
//   	res.locals.isMember = false;
//   	next();
//   }
// }

function checkMember(req, res, next) {
	if (req.isAuthenticated()){
		if (req.user.isMember){
			return next();
		}
	}
	else{
		res.redirect('/');
	}
}

function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();

  }
  else {

  	res.redirect('/');
  }
}

function checkAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.isAdmin = req.user.isAdmin;
    next();
  }
  else {
  	res.locals.isAdmin = false;
  	next();
  }
}

/* GET home page. */
router.get('/', controller.home_page);

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

router.get('/message',checkLoggedIn,controller.show_message_form );
router.post('/message',checkLoggedIn,controller.submit_message );


router.get('/makeMember',checkLoggedIn, controller.show_member_form);
router.post('/makeMember',checkLoggedIn, controller.check_member_code);

router.get('/delete/:id', controller.delete_message);


module.exports = router;