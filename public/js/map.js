const container = document.getElementById("mapid");
if (container) {
  var mymap = L.map("mapid").setView([14.602576, -87.832394], 13);

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

  var marker = L.marker([14.602576, -87.832394]).addTo(mymap);

  var marker = L.marker([14.6030133,-87.8335945]).addTo(mymap);
  
  var marker = L.marker([14.6106663,-87.8304576]).addTo(mymap);

}
