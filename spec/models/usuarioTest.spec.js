const mongoose = require("mongoose");

const Bicicleta = require("../../models/bicicleta");
const Usuario = require("../../models/usuario");
const Reserva = require("../../models/reserva");

describe("Usuario.Modelo", () => {
  console.log("\n>-----Se Inicio Test Modulo Usuarios -----<\n");

  beforeEach((done) => {
    mongoose.connection.close(done);
  });

  beforeEach((done) => {
    const mongoDB = "mongodb://localhost:27017/testdb";
    mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error: "));
    db.once("open", function () {
      console.log("\nWe are connected to test database!");
      done();
    });
  });

  afterEach((done) => {
    Reserva.deleteMany({}, function (err, success) {
      if (err) {
        console.log(err);
      }

      Usuario.deleteMany({}, function (err, success) {
        if (err) {
          console.log(err);
        }

        Bicicleta.deleteMany({}, function (err, success) {
          if (err) {
            console.log(err);
          }

          mongoose.connection.close(done);
        });
      });
    });
  });

  describe("Usuario reserva una Bici", () => {
    it("Debe existir la reserva", (done) => {
      const usuario = new Usuario({ nombre: "Diego Buezo" });
      usuario.save();

      const bicicleta = new Bicicleta({
        code: 1,
        color: "rojo",
        modelo: "urbana",
        ubicacion: [14.602576, -87.832394],
      });
      bicicleta.save();

      const hoy = "2020/9/11";
      const mañana = "2020/9/12";

      usuario.reservar(bicicleta._id, hoy, mañana, function (err, reserva) {
        Reserva.find({})
          .populate("bicicleta")
          .populate("usuario")
          .exec(function (err, reservas) {
            expect(reservas.length).toBe(1);
            expect(reservas[0].diasDeReserva()).toBe(2);
            expect(reservas[0].bicicleta.code).toBe(1);
            expect(reservas[0].usuario.nombre).toBe(usuario.nombre);

            console.log(
              "---- Fin Crear Usuario/Crear Bici/Realizar Reserva ----"
            );

            done();
          });
      });
    });
  });

  //Fin de test
});
