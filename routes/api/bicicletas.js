var express = require('express');
var router = express.Router();
var bicicletaController = require('../../controllers/api/bicicletaControllerAPI');

router.get('/', bicicletaController.bicicleta_list);
router.post('/create', bicicletaController.bicicleta_create);
router.put('/:id/update',bicicletaControllerApi.bicicleta_update_post)
router.delete('/:id/delete', bicicletaControllerApi.bicicleta_delete)

module.exports = router;