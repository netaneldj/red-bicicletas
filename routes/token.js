const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/token");

module.exports = function () {
  router.get("/confirmation/:token", tokenController.confirmation_get);
  return router;
};
