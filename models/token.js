const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
  },
  token: {
    type: String,
    required: true,
  },
  fechaCreacion: {
    type: Date,
    required: true,
    default: Date.now(),
    expires: 43200,
  },
});

module.exports = model("Token", tokenSchema);
