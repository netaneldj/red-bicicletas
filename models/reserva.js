const { Schema, model } = require("mongoose");
const moment = require("moment");

const reservaSchema = new Schema({
  desde: Date,
  hasta: Date,
  bicicleta: {
    type: Schema.Types.ObjectId,
    ref: "Bicicleta",
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
});

reservaSchema.methods.diasDeReserva = function () {
  return moment(this.hasta).diff(moment(this.desde), "days") + 1;
};

module.exports = model("Reserva", reservaSchema);
