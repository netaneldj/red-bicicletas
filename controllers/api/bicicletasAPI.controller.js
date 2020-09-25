const Bicicleta = require("../../models/Bicicleta");

exports.Bicicleta_list = async (req, res) => {
  try {
    const bicicletas = await Bicicleta.allBicis();
    res.status(200).json({ bicicletas });
  } catch (error) {
    res.status(404).json({ error: ["Error al listar los datos", error] });
  }
};

exports.Bicicleta_create = async (req, res) => {
  const { code, color, modelo, lat, lng } = req.body;

  try {
    let bici = new Bicicleta({ code, color, modelo, ubicacion: [lat, lng] });

    await Bicicleta.add(bici);

    res.status(200).json({ bicicleta: bici });
  } catch (error) {
    res.status(500).json({ error: ["Error al crear los datos", error] });
  }
};

exports.Bicicleta_update = async (req, res) => {
  const { code, color, modelo, lat, lng } = req.body;

  try {
    let bici = await Bicicleta.findByCode(code);
    bici.code = code;
    bici.color = color;
    bici.modelo = modelo;
    bici.ubicacion = [lat, lng];

    await bici.save();

    res.status(200).json({ bicicleta: bici });
  } catch (error) {
    res.status(500).json({ error: ["Error al actualizar los datos", error] });
  }
};

exports.Bicicleta_delete = async (req, res) => {
  try {
    const { code } = req.params;
    await Bicicleta.removeByCode(code);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ error: ["Error al eliminar los datos", error] });
  }
};
