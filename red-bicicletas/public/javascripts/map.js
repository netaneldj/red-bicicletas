var map = L.map('main_map').setView([-34.6012424,-58.3861497], 13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
}).addTo(map);

L.marker([-34.605902, -58.435716]).addTo(map)
L.marker([-34.568351, -58.417783]).addTo(map)
L.marker([-34.609848, -58.351524]).addTo(map)