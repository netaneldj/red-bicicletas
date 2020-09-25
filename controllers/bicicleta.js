const Bicicleta = require("../models/Bicicleta");

exports.Bicicleta_list = async (req, res) => {
  try {
    const bicicletas = await Bicicleta.allBicis();
    res.render("bicicletas/index", { bicis: bicicletas });
  } catch (error) {
    res.status(404).json({ error: ["Error al listar los datos", error] });
  }
};

exports.Bicicleta_create_get = (req, res) => {
  res.render("bicicletas/create");
};

exports.Bicicleta_create_post = async (req, res) => {
  const { code, color, modelo, lat, lng } = req.body;

  try {
    let bici = new Bicicleta({ code, color, modelo, ubicacion: [lat, lng] });

    await Bicicleta.add(bici);

    res.redirect("/bicicletas");
  } catch (error) {
    res.status(500).json({ error: ["Error al crear los datos", error] });
  }
};

exports.Bicicleta_update_get = async (req, res) => {
  const { id } = req.params;
  // console.log(req.params);
  try {
    const bici = await Bicicleta.findById(id);
    // console.log(bici);
    res.render("bicicletas/update", { bici });
  } catch (error) {
    res.status(500).json({ error: ["Error al crear los datos", error] });
  }
};

exports.Bicicleta_update_post = async (req, res) => {
  const { code, color, modelo, lat, lng } = req.body;
  console.log(req.body);
  try {
    let bici = await Bicicleta.findByCode(code);
    
    bici.code = code;
    bici.color = color;
    bici.modelo = modelo;
    bici.ubicacion = [lat, lng];
    console.log("new: " + bici);

    await bici.save();

    res.redirect("/bicicletas");
  } catch (error) {
    res.status(500).json({ error: ["Error al actualizar los datos", error] });
  }
};

exports.Bicicleta_delete_post = async (req, res) => {
  const { id } = req.params;
  try {
    await Bicicleta.findByIdAndRemove(id);
    res.redirect("/bicicletas");
  } catch (error) {
    res.status(500).json({ error: ["Error al actualizar los datos", error] });
  }
};
