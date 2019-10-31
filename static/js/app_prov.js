


function build_prov_map() {

// Tile layer
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
  return d >= 2.5 ? '#800026' :
         d >= 2  ? '#BD0026' :
         d >= 1.75  ? '#E31A1C' :
         d >= 1.5  ? '#FC4E2A' :
         d >= 1.25   ? '#FD8D3C' :
         d >= 1   ? '#FEB24C' :
         d >= .75   ? '#FED976' :
                    '#FFEDA0';
}


//Link to province geo-json
var prov_link = "/prov_geojson";


// Grabbing our GeoJSON data..
d3.json(prov_link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  var val_vote = L.geoJson(data.Val_vote);
  
  // //overlay population
  // overlayMaps.Value_of_Vote=population

  map = L.map("map-province", {
    center: [57.130367, -106.346771],
    zoom: 3,
    layers: [lightMap,val_vote]
  });

  //coloring choropleth
  function style(val_vote) {
    return {
        fillColor: getColor(val_vote.properties.Val_vote),
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '3',
        fillOpacity: 0.7
    };
  
  }

  L.geoJson(data.features, {style: style}).addTo(map);

  //creating mouse-over event
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
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
  val_vote.resetStyle(e.target);
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

  layer.bindTooltip("<h6>" + feature.properties.PRENAME + "</h6><hr><h6>Value of Vote: "+ Math.round(feature.properties.Val_vote*100)+"%</h6>");
}

val_vote = L.geoJson(data.features, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

//Legend
var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [.75,1,1.25,1.5,1.75,2,2.5],
        labels = ["<75%","75-100%","100-125%","125-150%","150-175%","175-200%","200%+"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i]*100 + (grades[i + 1]*100 ? '&ndash;' + grades[i + 1]*100  + '%<br>' : '%+');
        console.log(getColor(grades[i]));
    }

    return div;
};



L.control.layers(baseMaps,null, {
    collapsed: false
}).addTo(map);

legend.addTo(map);

});

}



function build_bubble_bullet() {

//bubble chart
d3.json("/prov_geojson", function(data) {
  // Saving variables for bubble chart
  var data = data.features;

  var population_bubble=[]
  var ridings=[];
  var value=[];
  var province=[];
  var size_bubble=[];
  var label_bubble=[];
  var text_bubble=[]


  for (var i = 0; i <data.length; i++) {
   population_bubble.push(data[i].properties.Population);
   ridings.push(data[i].properties.Ridings);
   value.push(data[i].properties.Val_vote);
   province.push(data[i].properties.PRENAME);
  }
  
  
  for (var i = 0; i <data.length; i++) {
    size_bubble.push(value[i]*15);
    label_bubble.push(Math.round(value[i]*100)+"%")
    text_bubble.push(province[i]+"</br>"+label_bubble[i]+" ")

   }
  
   console.log(province);
   console.log(label_bubble);


  var trace = {
    type: "scatter",
    mode: "markers",
    x: population_bubble,
    y: ridings,
    text: text_bubble,
    hoverinfo:'text+x+y',
    marker: {
      color: ['#FED976','#FED976','#800026','#800026','#FD8D3C','#800026','#FEB24C','#FED976','#FC4E2A','#BD0026','#FED976','#FD8D3C','#FEB24C'],
      size: size_bubble,
      
      // colorscale: 'YIOrRd',
    }
  };
  
  var scatter = [trace];
    
  var layout = {
    // title: 'Value of Vote vs. Population vs. #Seats',
    showlegend: false,
      xaxis: {
        type: 'log',
        title: {
          text: 'Population',
        }
      },
          
    yaxis: {
      title: {
        text: 'Seats',
      }
    }
  };
            
  Plotly.newPlot("bubble", scatter, layout);







//bullet chart
var bullet_data=[]

for (var i = 0; i <population_bubble.length; i++) {
  bullet_data.push({
    "category":province[i],
    "value":Math.round(population_bubble[i]/ridings[i]*.001),
    "target":100.4
  })
 }


/* Create chart instance */
var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.paddingRight = 10;

/* Add data */
chart.data = bullet_data

/* Create axes */
var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.minGridDistance = 30;
categoryAxis.renderer.grid.template.disabled = true;

var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.minGridDistance = 30;
valueAxis.renderer.grid.template.disabled = true;
valueAxis.min = 0;
valueAxis.max = 130;
valueAxis.strictMinMax = true;
valueAxis.renderer.labels.template.adapter.add("text", function(text) {
  return text+"k";
});

/* Create ranges */
function createRange(axis, from, to, color) {
  var range = axis.axisRanges.create();
  range.value = from;
  range.endValue = to;
  range.axisFill.fill = color;
  range.axisFill.fillOpacity = 0.8;
  range.label.disabled = true;
}

// d >= 2.5 ? '#800026' :
// d >= 2  ? '#BD0026' :
// d >= 1.75  ? '#E31A1C' :
// d >= 1.5  ? '#FC4E2A' :
// d >= 1.25   ? '#FD8D3C' :
// d >= 1   ? '#FEB24C' :
// d >= .75   ? '#FED976' :
//            '#FFEDA0';

createRange(valueAxis, 0, 40, am4core.color("#800026"));
createRange(valueAxis, 40, 50, am4core.color("#BD0026"));
createRange(valueAxis, 50, 57, am4core.color("#E31A1C"));
createRange(valueAxis, 57, 67, am4core.color("#FC4E2A"));
createRange(valueAxis, 67, 80, am4core.color("#FD8D3C"));
createRange(valueAxis, 80, 101, am4core.color("#FEB24C"));
createRange(valueAxis, 101, 130, am4core.color("#FED976"));

/* Create series */
var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueX = "value";
series.dataFields.categoryY = "category";
series.columns.template.fill = am4core.color("#000");
series.columns.template.stroke = am4core.color("#fff");
series.columns.template.strokeWidth = 1;
series.columns.template.strokeOpacity = 0.5;
series.columns.template.height = am4core.percent(25);

var series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.valueX = "target";
series2.dataFields.categoryY = "category";
series2.strokeWidth = 0;

var bullet = series2.bullets.push(new am4charts.Bullet());
var line = bullet.createChild(am4core.Line);
line.x1 = 0;
line.y1 = -15;
line.x2 = 0;
line.y2 = 15;
line.stroke = am4core.color("grey");
line.strokeWidth = 2;



chart.cursor = new am4charts.XYCursor();
valueAxis.cursorTooltipEnabled = true;

// var title = chart.titles.create();
// title.text = "Population('000) per Seat ";
// title.fontSize = 18;
// title.marginBottom = 20;

});
}

build_prov_map();
build_bubble_bullet();
