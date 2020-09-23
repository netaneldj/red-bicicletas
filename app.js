require('newrelic');
require('dotenv').config()
const createError = require('http-errors');
const assert = require('assert');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuarios');
const tokenRouter = require('./routes/token');
const bicicletasRouter = require('./routes/bicicletas');
const bicicletasAPIRouter = require('./routes/api/bicicletas');
const usuariosAPIRouter = require('./routes/api/usuarios');
const authAPIRouter = require('./routes/api/auth');
const authGoogle = require('./routes/google');
const authFacebook = require('./routes/facebook');

let store
if(process.env.NODE_ENV === 'development' ) {
   store = new session.MemoryStore
} else {
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });
  store.on('error', function(error){
    assert.ifError(error);
    assert.ok(false);
  })
}

const app = express();

app.set('secretKey', 'jwt_pwd_!12233445');

app.use(session({
  cookie: {
    maxAge: 240 * 60 * 60 * 100
  },
  store: store,
  saveUninitialized: true,
  resave: true,
  secret: 'red_biciceasdadasd3424#@|~@#'
}))

//'mongodb+srv://admin:admin@red-bicicletas.nqfb9.mongodb.net/<dbname>?retryWrites=true&w=majority'
//'mongodb://localhost/red_bicicletas'
const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, {
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
app.use('/api/auth', authAPIRouter);
app.use('/api/bicicletas', validarUsuario, bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/auth/google', authGoogle);
app.use('/auth/facebook', authFacebook);

app.use('/privacy_police', function(req, res){
  res.sendFile('public/privacy_police.html');
})

app.use('/google4705337402e4a5b2', function(req, res){
  res.sendFile('public/google4705337402e4a5b2.html');
})

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

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log('user sin loguearse');
    res.redirect('/login')
  }
}

function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      res.json({
        status: "error",
        message: err.message,
        data: null
      });
    } else {
      req.body.userId = decoded.id
      console.log('jwt verifyt: ', decoded);
      next();
    }
  })
}

module.exports = app;
