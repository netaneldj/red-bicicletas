const { Schema, model } = require("mongoose");
const Reserva = require("../models/Reserva");
const Token = require("../models/Token");
require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");
const mailer = require("../mailer/mailer");

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "El email es obligatorio"],
    lowercase: true,
    unique: true,
    validate: [validateEmail, "El email no es valido"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
  password: {
    type: String,
    required: [true, "El password es obligatorio"],
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  verificado: {
    type: Boolean,
    default: false,
  },
  googleId: String,
  facebookId: String,
});

usuarioSchema.plugin(uniqueValidator, {
  message: "El {PATH} ya existe con otro usuario",
});

usuarioSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }
  next();
});

usuarioSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
  const reserva = new Reserva({
    desde,
    hasta,
    bicicleta: biciId,
    usuario: this._id,
  });
  reserva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
  const token = new Token({
    usuario: this.id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  const email_destination = this.email;

  token.save(function (err) {
    if (err) {
      console.log(err);
    }

    const mailOptions = {
      from: process.env.SENDING_EMAIL_ADDRESS,
      to: email_destination,
      subject: "Verificación de Cuenta",
      text:
        "Hola,\n\n" +
        "Por favor, para verificar su cuenta haga click en este link:\n\n" +
        process.env.APP_BASE_URL +
        "/token/confirmation/" +
        token.token +
        ".\n",
      html:
        "Hola,<br><br>" +
        "Por favor, para verificar su cuenta haga click en este link:<br><br>" +
        '<a href="' +
        process.env.APP_BASE_URL +
        "/token/confirmation/" +
        token.token +
        '" target="_blank">Activar Usuario</a>.<br>',
    };

    mailer.sendMail(mailOptions, function (err) {
      if (err) {
        console.log(err);
      }

      console.log(
        "Se ha enviado un email de verificación a " + email_destination + "."
      );
    });
  });
};

usuarioSchema.methods.resetPassword = function (cb) {
  const token = new Token({
    usuario: this.id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  const email_destination = this.email;

  token.save(function (err) {
    if (err) {
      return cb(err);
    }

    const mailOptions = {
      from: process.env.SENDING_EMAIL_ADDRESS,
      to: email_destination,
      subject: "Reseteo de Password de Cuenta",
      text:
        "Hola,\n\n" +
        "Por favor, para resetear el password de su cuenta haga click en este link:\n\n" +
        process.env.APP_BASE_URL +
        "/resetPassword/" +
        token.token +
        ".\n",
      html:
        "Hola,<br><br>" +
        "Por favor, para resetear el password de su cuenta haga click en este link:<br><br>" +
        '<a href="' +
        process.env.APP_BASE_URL +
        "/resetPassword/" +
        token.token +
        '" target="_blank">Restablecer Contraseña</a>.<br>',
    };

    mailer.sendMail(mailOptions, function (err) {
      if (err) {
        return cb(err);
      }

      console.log(
        "Se envió un email para restablecer contraseña a " +
          email_destination +
          "."
      );
    });

    cb(null);
  });
};

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(
  condition,
  callback
) {
  const self = this;
  console.log(condition);

  this.findOne(
    {
      $or: [{ googleId: condition.id }, { email: condition.emails[0].value }],
    },
    (err, result) => {
      if (result) {
        callback(err, result);
      } else {
        let values = {};
        console.log("=============== CONDITION ===============");
        console.log(condition);

        values.googleId = condition.id;
        values.email = condition.emails[0].value;
        values.nombre = condition.displayName || "SIN NOMBRE";
        values.verificado = true;
        values.password = crypto.randomBytes(16).toString("hex");

        console.log("=============== VALUES ===============");
        console.log(values);

        self.create(values, function (err, user) {
          if (err) {
            console.log(err);
          }

          return callback(err, user);
        });
      }
    }
  );
};

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(
  condition,
  callback
) {
  const self = this;
  console.log(condition);

  this.findOne(
    {
      $or: [{ facebookId: condition.id }, { email: condition.emails[0].value }],
    },
    (err, result) => {
      if (result) {
        callback(err, result);
      } else {
        let values = {};
        console.log("=============== CONDITION ===============");
        console.log(condition);

        values.facebookId = condition.id;
        values.email = condition.emails[0].value;
        values.nombre = condition.displayName || "SIN NOMBRE";
        values.verificado = true;
        values.password = crypto.randomBytes(16).toString("hex");

        console.log("=============== VALUES ===============");
        console.log(values);

        self.create(values, function (err, user) {
          if (err) {
            console.log(err);
          }

          return callback(err, user);
        });
      }
    }
  );
};

module.exports = model("Usuario", usuarioSchema);
