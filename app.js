const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const ejsLint = require('ejs-lint');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passport = require("passport");
const User = require('./models/user');
const initializePassport = require('./config/passport');
const flash = require('express-flash');
const app = express();
const dotenv = require('dotenv');
dotenv.config();



//mongo atlas conncetion
const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_ATLAS_KEY;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

initializePassport(passport);

app.use(flash());
app.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//login check for template 
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

app.use(function(req, res, next) {
	if (req.isAuthenticated()){
		res.locals.currentUser = req.user;
	}
  else{
    res.locals.currentUser = {};
  }
  next();
});

app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.isMember = req.user.isMember;
    next();
  }
  else {
  	res.locals.isMember = false;
  	next();
  }
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// require('./controllers/passport.js')(passport);
module.exports = app;