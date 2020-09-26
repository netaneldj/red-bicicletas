const express = require("express");
const router = express.Router();
const passport = require("passport");

const authControllerAPI = require("../../controllers/api/authControllerApi");

module.exports = function () {
  router.post("/authenticate", authControllerAPI.authenticate);
  router.post("/forgotPassword", authControllerAPI.forgotPassword);

  router.post(
    "/facebook_token",
    passport.authenticate("facebook-token"),
    authControllerAPI.authFacebookToken
  );

  return router;
};
