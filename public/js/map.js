const container = document.getElementById("mapid");
if (container) {
  var mymap = L.map("mapid").setView([-34.586842, -58.395056], 13);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiZHJiYyIsImEiOiJja2VuN2ZjNnMwNTZpMnJtbzkzbHlsbHM0In0.GZp_frI-PZeN9muW8XYBYg",
    }
  ).addTo(mymap);

  var marker = L.marker([-34.568455, -58.417751]).addTo(mymap);

  var marker = L.marker([-34.605295, -58.436372]).addTo(mymap);
  
  var marker = L.marker([-34.608181, -58.352275]).addTo(mymap);

}
