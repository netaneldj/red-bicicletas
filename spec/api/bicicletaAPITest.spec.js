const request = require("request");
const mongoose = require("mongoose");

const Bicicleta = require("../../models/Bicicleta");

const server = require("../../bin/www");
const host = "http://localhost:3000/api/bicicletas";

describe("Bicicleta.API", () => {
  console.log("\n>-----Se Inicio Test API Bicicletas -----<\n");

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

  describe("GET Bicicletas", () => {
    it("Status 200", (done) => {
      request.get(host, function (error, response, body) {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(200);
        expect(result.bicicletas.length).toBe(0);

        console.log("---- Fin Obtener Bicicletas ----");
        done();
      });
    });
  });

  describe("POST Bicicletas /create", () => {
    it("Status 200", (done) => {
      const headers = { "content-type": "application/json" };
      const aBici =
        '{"code": 2, "color": "rojo", "modelo": "montaña", "lat": 14.602576, "lng": -84.832394}';

      request.post(
        {
          headers,
          url: `${host}/create`,
          body: aBici,
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(200);
          const result = JSON.parse(body).bicicleta;

          expect(result.code).toBe(2);
          expect(result.color).toBe("rojo");
          expect(result.modelo).toBe("montaña");
          expect(result.ubicacion[0]).toBe(14.602576);
          expect(result.ubicacion[1]).toBe(-84.832394);

          console.log("---- Fin Crear Bicicleta ----");
          done();
        }
      );
    });
  });

  describe("PUT Bicicletas /update", () => {
    it("Status 200", (done) => {
      const headers = { "content-type": "application/json" };
      const aBici =
        '{"code": 1, "color": "rojo", "modelo": "ruta", "lat": 14.602576, "lng": -84.832394}';

      request.post(
        {
          headers,
          url: `${host}/create`,
          body: aBici,
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(200);

          const newBici =
            '{"code": 1, "color": "verde", "modelo": "montaña", "lat": 13.602576, "lng": -83.832394}';
          request.put(
            {
              headers,
              url: `${host}/update`,
              body: newBici,
            },
            function (error, response, body) {
              expect(response.statusCode).toBe(200);

              const result = JSON.parse(body).bicicleta;

              expect(result.code).toBe(1);
              expect(result.color).toBe("verde");
              expect(result.modelo).toBe("montaña");
              expect(result.ubicacion[0]).toBe(13.602576);
              expect(result.ubicacion[1]).toBe(-83.832394);

              console.log("---- Fin Modificar Bicicleta ----");
              done();
            }
          );
        }
      );
    });
  });

  describe("DELETE Bicicletas /:code/delete", () => {
    it("Status 200", (done) => {
      const headers = { "content-type": "application/json" };
      const aBici =
        '{"code": 1, "color": "rojo", "modelo": "ruta", "lat": 14.602576, "lng": -84.832394}';

      request.post(
        {
          headers,
          url: `${host}/create`,
          body: aBici,
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(200);

          request.delete(
            {
              headers,
              url: `${host}/${1}/delete`,
            },
            function (error, response, body) {
              expect(response.statusCode).toBe(200);

              Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);

                console.log("---- Fin Eliminar Bicicleta ----");

                done();
              });
            }
          );
        }
      );
    });
  });
});
