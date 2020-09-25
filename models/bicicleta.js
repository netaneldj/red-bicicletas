const { Schema, model } = require("mongoose");

const bicicletaSchema = new Schema({
  code: Number,
  color: String,
  modelo: String,
  ubicacion: {
    type: [Number],
    index: {
      type: "2dsphere",
      sparse: true,
    },
  },
});

bicicletaSchema.statics.createInstance = function (
  code,
  color,
  modelo,
  ubicacion
) {
  return new this({
    code,
    color,
    modelo,
    ubicacion,
  });
};

bicicletaSchema.methods.toString = function () {
  return (
    "code: " +
    this.code +
    " | color: " +
    this.color +
    " | modelo: " +
    this.modelo
  );
};

bicicletaSchema.statics.allBicis = function (cb) {
  return this.find({}, cb);
};

bicicletaSchema.statics.add = function (aBici, cb) {
  this.create(aBici, cb);
};

bicicletaSchema.statics.findByCode = function (code, cb) {
  return this.findOne({ code }, cb);
};

bicicletaSchema.statics.removeByCode = function (code, cb) {
  return this.deleteOne({ code }, cb);
};

module.exports = model("Bicicleta", bicicletaSchema);
