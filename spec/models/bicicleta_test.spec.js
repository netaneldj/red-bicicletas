const mongoose = require("mongoose");

const Bicicleta = require("../../models/bicicleta");

describe("Bicicleta.Modelo", () => {
  console.log("\n>-----Se Inicio Test Modulo Bicicletas -----<\n");

  // beforeEach(function () {
  //   originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  //   jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  // });

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
    Bicicleta.deleteMany({}, function (err, success) {
      if (err) {
        console.log(err);
      }
      mongoose.connection.close(done);
    });
  });

  describe("Bicicleta.createInstance", () => {
    it("Crea una instancia de Bicicleta", () => {
      const bici = Bicicleta.createInstance(1, "rojo", "urbana", [
        14.602576,
        -87.832394,
      ]);

      expect(bici.code).toBe(1);
      expect(bici.color).toBe("rojo");
      expect(bici.modelo).toBe("urbana");
      expect(bici.ubicacion[0]).toEqual(14.602576);
      expect(bici.ubicacion[1]).toEqual(-87.832394);

      console.log("---- Fin Crear Instancia Bicicletas ----");
    });
  });

  describe("Bicicleta.allBicis", () => {
    it("Comienza vacío", (done) => {
      Bicicleta.allBicis(function (err, bicis) {
        expect(bicis.length).toBe(0);

        console.log("---- Fin Listar Bicicletas ----");

        done();
      });
    });
  });

  describe("Bicicleta.add", () => {
    it("Agregar una Bicicleta", (done) => {
      const aBici = new Bicicleta({
        code: 1,
        color: "rojo",
        modelo: "urbana",
        ubicacion: [14.602576, -87.832394],
      });

      Bicicleta.add(aBici, function (err, newBici) {
        if (err) {
          console.log(`Error: ${err}`);
        }

        Bicicleta.allBicis(function (err, targetBici) {
          expect(targetBici.length).toBe(1);
          expect(targetBici[0].code).toBe(aBici.code);
          expect(targetBici[0].color).toBe(aBici.color);
          expect(targetBici[0].modelo).toBe(aBici.modelo);

          console.log("---- Fin Bicicleta.Add ----");

          done();
        });
      });
    });
  });

  describe("Bicicleta.findByCode", () => {
    it("Debe buscar la Bicicleta con el código 1", (done) => {
      Bicicleta.allBicis(function (err, bicis) {
        expect(bicis.length).toBe(0);

        const aBici = new Bicicleta({
          code: 1,
          color: "rojo",
          modelo: "urbana",
          ubicacion: [14.602576, -87.832394],
        });

        Bicicleta.add(aBici, function (err, newBici) {
          if (err) {
            console.log(`Error: ${err}`);
          }

          const bBici = new Bicicleta({
            code: 2,
            color: "verde",
            modelo: "urbana",
            ubicacion: [12.602576, -84.832394],
          });

          Bicicleta.add(bBici, function (err, newBici) {
            if (err) {
              console.log(`Error: ${err}`);
            }

            Bicicleta.findByCode(1, function (err, targetBici) {
              expect(targetBici.code).toBe(aBici.code);
              expect(targetBici.color).toBe(aBici.color);
              expect(targetBici.modelo).toBe(aBici.modelo);

              console.log("---- Fin  Bicicleta.findByCode ----");

              done();
            });
          });
        });
      });
    });
  });

  describe("Bicicleta.removeByCode", () => {
    it("Debe borrar la Bicicleta con el código 1", (done) => {
      Bicicleta.allBicis(function (err, bicis) {
        expect(bicis.length).toBe(0);

        const aBici = new Bicicleta({
          code: 1,
          color: "rojo",
          modelo: "urbana",
          ubicacion: [14.602576, -87.832394],
        });

        Bicicleta.add(aBici, function (err, newBici) {
          if (err) {
            console.log(`Error: ${err}`);
          }

          Bicicleta.removeByCode(1, function (err) {
            if (err) {
              console.log(`Error: ${err}`);
            }

            Bicicleta.allBicis(function (err, newBicis) {
              expect(newBicis.length).toBe(0);

              console.log("---- Fin  Bicicleta.removeByCode ----");

              done();
            });
          });
        });
      });
    });
  });

  //Fin de test
});
