const Usuario = require("../../models/usuario");

exports.Usuario_list = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json({ usuarios });
  } catch (error) {
    res.status(500).json({ error: ["Error al listar los usuarios", error] });
  }
};

exports.Usuario_create = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const usuario = new Usuario({
      nombre,
      email,
      password,
    });

    await usuario.save();
    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ error: ["Error al crear el usuario", error] });
  }
};

exports.Usuario_reservar = async (req, res) => {
  const { _id, biciId, desde, hasta } = req.body;
  Usuario.findById(_id, function (err, usuario) {
    usuario.reservar(biciId, desde, hasta, function () {
      res.status(200).json({ reserva: { biciId, desde, hasta } });
    });
  });
};
