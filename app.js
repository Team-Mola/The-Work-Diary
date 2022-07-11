const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const http = require('http');
const con = require('./bin/db');
__dirname = path.resolve();
require('dotenv').config();

const route = {
  indexRouter: require('./routes/index'),
  loginRouter: require('./routes/login'),
  joinRouter: require('./routes/join'),

}
const port = 8080;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);


con.connect(function(err){
  if(err) throw err;
  console.log("DB Connected!!!");
});

module.exports = con;

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.use('/', route.indexRouter);
app.use('/login', route.loginRouter);
app.use('/join', route.joinRouter);

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

app.listen(port, () => console.log(`part-time-job app listening on port ${port}`));

module.exports = app;