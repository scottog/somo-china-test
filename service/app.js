const https = require('https')
const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const port = 9000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const allowList = [/\.somo-just-testing\.com$/, /\.localhost$/]
const corsOptionsDelegate = function (req, callback) {
  var corsOptions
  if (allowList.indexOf(req.header('Origin')) !== -1) {
    // reflect (enable) the requested origin in the CORS response
    corsOptions = { origin: true }
  } else {
     // disable CORS for this request
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(port, () => {
  console.log(`Test service running on ${port}`)
})

// https.createServer({
//   key: fs.readFileSync('./cert/domain.key'),
//   cert: fs.readFileSync('./cert/domain.crt')
// }, app).listen(port, () => {
//   console.log(`Test service running on ${port}`)
// })

module.exports = app;
