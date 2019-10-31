function build_ed_map() {

// Creating map object


  // Adding tile layer
  lightMap=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
})

satelliteMap=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
})
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightMap,
    "Satellite": satelliteMap
  };
  
  // var overlayMaps = {};
  var map;
  
   //Fill colors
   function getColor(d) {
    return d == '24' ? '#800026' :
           d == '35'  ? '#BD0026':
           d == '10'  ? '#E31A1C':
           d == '11'  ? '#FC4E2A':
           d == '12'  ? '#FD8D3C':
           d == '13'  ? '#FEB24C':
           d == '48'  ? '#FED976':
           d == '46'  ? '#2ca25f':
           d == '47'  ? '#43a2ca':
           d == '59'  ? '#bcbddc':
           d == '60'  ? '#edf8b1':
           d == '61'  ? '#fa9fb5':
           d == '62'  ? '#a6cee3':
                        '#FFEDA0';
  }


  var link = "/ed_geojson";
  
  // Grabbing our GeoJSON data..
  d3.json(link, function(data) {
    // Creating a GeoJSON layer with the retrieved data
   var elec_dist = L.geoJson(data);
    console.log(data.features);
  

  map = L.map("map-ed", {
    center: [57.130367, -106.346771],
    zoom: 3,
    layers: [lightMap,elec_dist]
  });
  
 
  //coloring choropleth
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.PRUID),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  } 

L.geoJson(data.features, {style: style}).addTo(map);

//creating mouse-over event
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}  
  
  //mouseout
  function resetHighlight(e) {
  elec_dist.resetStyle(e.target);
  }

  //click
  function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
  }
  
  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
    layer.bindTooltip("<h6>" + feature.properties.FEDNAME + 
                      "</h6><hr><h6>Province "+ feature.properties.PRNAME +"</h6>");
  }
  elec_dist = L.geoJson(data.features, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
  

  L.control.layers(baseMaps,null, {
    collapsed: false
  }).addTo(map);


  });

  }

build_ed_map();