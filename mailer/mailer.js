const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
require("dotenv").config();
let mailConfig;

if (process.env.NODE_ENV === "production") {
  const options = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  };

  mailConfig = sgTransport(options);
} else {
  if (process.env.NODE_ENV === "staging") {
    const options = {
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      },
    };

    mailConfig = sgTransport(options);
  } else {
    // Development
    mailConfig = {
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PWD,
      },
    };
  }
}

module.exports = nodemailer.createTransport(mailConfig);

// mailConfig.verify((err, success) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log("Your nodemailer config is correct");
//   }
// });
