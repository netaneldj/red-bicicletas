const mongoose = require("mongoose");
const request = require("request");

const Bicicleta = require("../../models/Bicicleta");
const Usuario = require("../../models/Usuario");
const Reserva = require("../../models/Reserva");

const server = require("../../bin/www");
const host = "http://localhost:3000/api";

describe("Usuario.API", () => {
  console.log("\n>-----Se Inicio Test API Usuarios -----<\n");

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

  describe("GET Usuarios", () => {
    it("Status 200", (done) => {
      request.get(`${host}/usuarios`, function (error, response, body) {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(200);
        expect(result.usuarios.length).toBe(0);

        console.log("---- Fin Obtener Usuarios----");
        done();
      });
    });
  });

  describe("POST Usuarios /create", () => {
    it("Status 200", (done) => {
      const headers = { "content-type": "application/json" };
      const aUser = '{"nombre":"Diego Buezo"}';

      request.post(
        {
          headers,
          url: `${host}/usuarios/create`,
          body: aUser,
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(200);
          const result = JSON.parse(body).usuario;

          expect(result.nombre).toBe("Diego Buezo");

          console.log("---- Fin Crear Usuario ----");

          done();
        }
      );
    });
  });

  describe("POST Usuarios /reservar", () => {
    it("Status 200", (done) => {
      const headers = { "content-type": "application/json" };
      const User = '{"nombre":"Diego Buezo"}';

      request.post(
        {
          headers,
          url: `${host}/usuarios/create`,
          body: User,
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(200);
          const user_id = JSON.parse(body).usuario._id;
          const aBici =
            '{"code": 2, "color": "rojo", "modelo": "montaña", "lat": 14.602576, "lng": -84.832394}';

          request.post(
            {
              headers,
              url: `${host}/bicicletas/create`,
              body: aBici,
            },
            function (error, response, body) {
              expect(response.statusCode).toBe(200);
              const aReser =
                '{ "_id": "' +
                user_id +
                '", "desde":"2020/9/11", "hasta":"2020/9/12"}';
              request.post(
                {
                  headers,
                  url: `${host}/usuarios/reservar`,
                  body: aReser,
                },
                function (error, response, body) {
                  expect(response.statusCode).toBe(200);
                  const result = JSON.parse(body).reserva;
                  expect(result.desde).toBe("2020/9/11");
                  expect(result.hasta).toBe("2020/9/12");

                  console.log("---- Fin Crear Reserva ----");

                  done();
                }
              );
            }
          );
        }
      );
    });
  });

  //Fin de test
});
