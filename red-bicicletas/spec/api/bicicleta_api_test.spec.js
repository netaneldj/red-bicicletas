var mongoose = require('mongoose');
var axios = require('axios');
var Bicicleta = require('../../models/bicicleta');
var server = require('../../bin/www')
var URL = 'http://localhost:3000/api/bicicletas';

describe('Bicicleta API', () => {
    
	beforeEach(function(done){
        var  mongoDB = 'mongodb://localhost/red_bicicletas';
        mongoose.connect(mongoDB, { useNewUrlParser: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console,'connection error'));
        db.once('open', function() {
            console.log('We are connected to test database!');
            done();
        })
    })

    afterEach(function (done) {
        Bicicleta.deleteMany({},function (err, success) {
            if(err) console.log(err);
            done();          
        })
    })  

    describe('GET BICICLETAS /', () => {
        it('Status 200', async () => {
			axios.get(URL, function (error, response, body) {
				let data = JSON.parse(body)
				expect(response.status).toBe(200);
				expect(data.bicicletas.length).toBe(0);
				done();
			})
        })
    })

    describe('POST BICICLETAS /create', () => {
        it('STATUS 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{"code":10, "color":"rojo", "modelo":"urbana", "lat":-34, "lng":-54}';
            
			axios.post(URL + '/create', aBici, {
				headers: headersR
			})
			.then(response => {
			  expect(response.status).toBe(200);
			  let bici = response.data.bicicleta
			  expect(bici.code).toBe(aBici.code)
			  expect(bici.color).toBe(aBici.color)
			  expect(bici.modelo).toBe(aBici.modelo)
			  expect(bici.ubicacion[0]).toBe(Number(aBici.lat))
			  expect(bici.ubicacion[1]).toBe(Number(aBici.lng))

			  done();
            })
        })
    })

	describe('PUT BICICLETAS /update', () => {
		it('STATUS 200', (done) => {
		  var headersR = {
			'content-type': 'application/json'
		  };
		  var bici = new Bicicleta({
			code: 10,
			color: "azul",
			modelo: "urbana",
			ubicacion: [-54.36, -74.35]
		  });
		  bici.save();
		  let update = {
			color: "azul",
			modelo: "Deportiva"
		  }
		  axios.put(`${URL}/${bici.id}/update`, update, {
			  headers: headersR
			})
			.then(response => {
			  expect(response.status).toBe(200);
			  Bicicleta.findById(bici.id).exec((err, biciBD) => {
				expect(biciBD.modelo).toBe(update.modelo)
				expect(biciBD.color).toBe(update.color)
				done();
			  })
			})
		})
	})

  /* describe('DELETE BICICLETAS /delete', () => {
     it('STATUS 204', (done) => {
       var headersR = {
         'content-type': 'application/json'
       };
       var aBici = {
         "id": 10,
         "color": "rojo",
         "modelo": "urbana"
       }
       Bicicleta.add(aBici);
       axios.delete(`http://localhost:3000/api/bicicletas/${aBici.id}/delete`, {
           headers: headersR
         })
         .then(response => {
           expect(response.status).toBe(204);
           expect(() => {
               Bicicleta.findById(aBici.id)
             })
             .toThrow(new Error(`No existe una bicicleta con el id ${aBici.id}`))
           done();
         })
     })
	})*/

    /*describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(err, newBici){
                    if (err) console.log(err);

                    var aBici2 = new Bicicleta({code: 2, color: "roja", modelo: "urbana"});
                    Bicicleta.add(aBici2, function(err, newBici){
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, function(error, targetBici){
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);

                            done();
                        });
                    });
                });
            });
        });
    });*/
});