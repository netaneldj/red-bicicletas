var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
require("dotenv").config();
require("newrelic");

const passport = require("./config/passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const jwt = require("jsonwebtoken");
const { assert } = require("console");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/usuarios");
var tokenRouter = require("./routes/token");
var bicicletasRouter = require("./routes/bicicletas.route");

var authAPIRouter = require("./routes/api/authApi.route");
var bicicletasAPIRouter = require("./routes/api/bicicletasAPI.route");
var usuariosAPIRouter = require("./routes/api/usuariosAPI.route");
// require("events").EventEmitter.prototype._maxListeners = 0;

const Usuario = require("./models/Usuario");
const Token = require("./models/Token");

// Sesiones
let store;

if (process.env.NODE_ENV === "development") {
  // En memoria
  store = session.MemoryStore();
} else {
  // En base de datos
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });

  store.on("error", function (err) {
    assert.ifError(err);
    assert.ok(false);
  });
}

var app = express();

app.set("secretKey", "jwt_NAmR6OlNUP8SpPhLHa8N");

// Configurar Session
app.use(
  session({
    cookie: { maxAge: 240 * 60 * 60 * 1000 },
    store: store,
    saveUninitialized: true,
    resave: "true",
    secret: "red_bicis_NAmR6OlNUPFtakVCiChy",
  })
);

// Mongodb conexión
require("./config/db");
const transport = require("./mailer/mailer");
transport.verify((err, success) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Your nodemailer config is correct");
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

// Authentication Routes
app.get("/login", function (req, res) {
  res.render("session/login");
});

app.post("/login", function (req, res, next) {
  // passport
  passport.authenticate("local", function (err, usuario, info) {
    if (err) {
      return next(err);
    }

    if (!usuario) {
      return res.render("session/login", { info });
    }

    req.logIn(usuario, function (err) {
      if (err) {
        return next(err);
      }

      return res.redirect("/");
    });
  })(req, res, next);
});

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

app.get("/forgotPassword", function (req, res) {
  res.render("session/forgotPassword");
});

app.post("/forgotPassword", function (req, res, next) {
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    if (!usuario) {
      return res.render("session/forgotPassword", {
        info: { message: "No existe un usuario con el email ingresado" },
      });
    }

    usuario.resetPassword(function (err) {
      if (err) {
        console.log("session/forgotPasswordMessage");
        return next(err);
      }
    });

    res.render("session/forgotPasswordMessage");
  });
});

app.get("/resetPassword/:token", function (req, res, next) {
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token) {
      return res.status(400).send({
        type: "not-verified",
        msg:
          "No existe un usuario asociado al token. Verifique que su token no haya expirado.",
      });
    }

    Usuario.findById(token.usuario, function (err, usuario) {
      if (!usuario) {
        return res.status(400).send({
          msg: "No existe un usuario asociado al token",
        });
      }

      res.render("session/resetPassword", { errors: {}, usuario: usuario });
    });
  });
});

app.post("/resetPassword", function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    res.render("session/resetPassword", {
      errors: {
        confirm_password: {
          message: "No coincide con el password ingresado",
        },
      },
      usuario: new Usuario({ email: req.body.email }),
    });
    return;
  }

  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    usuario.password = req.body.password;

    usuario.save(function (err) {
      if (err) {
        res.render("session/resetPassword", {
          errors: err.errors,
          usuario: new Usuario({ email: req.body.email }),
        });
      } else {
        res.redirect("/login");
      }
    });
  });
});
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/plus.profile.emails.read",
      "profile",
      "email",
    ],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.use("/", indexRouter);

app.use("/usuarios", usersRouter());
app.use("/token", tokenRouter());
app.use("/bicicletas", loggedIn, bicicletasRouter());

// API Routes
app.use("/api/auth", authAPIRouter());
app.use("/api/bicicletas", validarUsuario, bicicletasAPIRouter());
app.use("/api/usuarios", usuariosAPIRouter());

app.use("/privacy_policy", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/politicas_de_privacidad.html"));
});
app.use("/googlef701b2931731bc86", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/googlef701b2931731bc86.html"));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log("Usuario sin loguearse!");
    res.redirect("/login");
  }
}

function validarUsuario(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function (
    err,
    decoded
  ) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      req.body.userId = decoded.id;
      console.log("JWT Verify: " + decoded);

      next();
    }
  });
}

module.exports = app;
