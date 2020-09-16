var Bicicleta = function(id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function (){
    return "id: " + this.id + " | color: " + this.color + " | modelo "+ this.modelo;
}

Bicicleta.allBicis = [];
Bicicleta.add = function(aBici) {
    Bicicleta.allBicis.push(aBici);
}

var a = new Bicicleta(1, 'rojo', 'urbana', [-34.584595, -58.408742]);
var b = new Bicicleta(2, 'blanca', 'urbana', [-34.582533, -58.417165]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta;