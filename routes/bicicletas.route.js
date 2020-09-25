const { Router } = require("express");
const router = Router();

const bicicletaController = require("../controllers/bicicleta");

module.exports = function () {
  router.get("/", bicicletaController.Bicicleta_list);
  router.get("/create", bicicletaController.Bicicleta_create_get);
  router.post("/create", bicicletaController.Bicicleta_create_post);
  router.post("/:id/delete", bicicletaController.Bicicleta_delete_post);
  router.get("/:id/update", bicicletaController.Bicicleta_update_get);
  router.post("/update", bicicletaController.Bicicleta_update_post);
  return router;
};
