const { Router } = require("express");
const router = Router();

const usuarioAPIController = require("../../controllers/api/usuariosControllerApi");

module.exports = function () {
  router.get("/", usuarioAPIController.Usuario_list);
  router.post("/create", usuarioAPIController.Usuario_create);
  router.post("/reservar", usuarioAPIController.Usuario_reservar);
  return router;
};
