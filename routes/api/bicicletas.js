const { Router } = require("express");
const router = Router();

const bicicletaAPIController = require("../../controllers/api/bicicletasControllerApi");

module.exports = function () {
  router.get("/", bicicletaAPIController.Bicicleta_list);
  router.post("/create", bicicletaAPIController.Bicicleta_create);
  router.put("/update", bicicletaAPIController.Bicicleta_update);
  router.delete("/:code/delete", bicicletaAPIController.Bicicleta_delete);
  return router;
};
