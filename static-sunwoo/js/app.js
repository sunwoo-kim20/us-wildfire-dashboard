// // Create the createMap function
// function createMap(startingCoords, mapZoomLevel, wildfireYears) {
//
//   // Create a baseMaps object to hold the satellite layer
//   var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/satellite-v9",
//     accessToken: API_KEY
//   });
//
//   // Create a baseMaps object to hold the darkmap layer
//   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "dark-v10",
//     accessToken: API_KEY
//   });
//
//   // Create a baseMaps object to hold the lightmap layer
//   var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "light-v10",
//     accessToken: API_KEY
//   });
//
//   var baseMaps = {
//     Satellite: satellitemap,
//     Dark: darkmap,
//     Light: lightmap
//   };
//   // Create an overlayMaps object to hold the earthquakes layer
//   overlayMaps = {
//     Year2011: wildfireYears[0],
//     Year2012: wildfireYears[1],
//     Year2013: wildfireYears[2],
//     Year2014: wildfireYears[3],
//     Year2015: wildfireYears[4]
//   };
//
//   // Create the map object with options
//   var myMap = L.map("map", {
//     center: startingCoords,
//     zoom: mapZoomLevel,
//     layers: [satellitemap, wildfireYears[0]]
//   });
//
//   // Create layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps).addTo(myMap);
//
//   // // Legend set up
//   // var legend = L.control({ position: "bottomright" });
//   // legend.onAdd = function() {
//   //   var div = L.DomUtil.create("div", "info legend");
//   //   var limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
//   //   var colors = ["#ccffcc", "#ccff99", "#ffff99", "#ffdb4d", "#e68a00","#cc0000"];
//   //   var labels = [];
//   //
//   //   // Add levels
//   //   var legendInfo = "<h1>Fire Size</h1>" +
//   //     "<div class=\"labels\">"
//   //
//   //   div.innerHTML = legendInfo;
//   //
//   //   limits.forEach(function(limit, index) {
//   //     labels.push("<li style=\"background-color: " + colors[index] + "\">" + limit + "</li>");
//   //   });
//   //   for (var i = 0; i < limits.length; i++) {
//   //     div.innerHTML += "<ul>" + labels[i] + "</ul>";
//   //   }
//   //
//   //   return div;
//   // };
//   //
//   // // Adding legend to the map
//   // legend.addTo(myMap);
//
// }
//
// // Create function to select color for circles
// function chooseColor(fireClass) {
//   // Initialize color variable
//   var color = "";
//   // Assign color by fire class
//   switch (fireClass) {
//     case "A":
//       color = "#ccff99";
//       break;
//     case "B":
//       color = "#fff75d";
//       break;
//     case "C":
//       color = "#ffc11f";
//       break;
//     case "D":
//       color = "#fe650d";
//       break;
//     case "E":
//       color = "#f33c04";
//       break;
//     case "F":
//       color = "#da1f05";
//       break;
//     case "G":
//       color = "#a10100";
//       break;
//     default:
//       color = "#fffff";
//   }
//   return color;
// }
//
//
// // Create the createCircles function
// function createCircles(fireData, year) {
//
//   // Initialize an array to hold the fire data
//   var fireCircles = [];
//
//   // Loop through the fire data
//     // For each fire, create a circle and bind a popup with additional info
//   fireData.forEach(function(fire) {
//     if (fire.FIRE_YEAR === year) {
//       var fireInfo = `Fire Name: ${fire.FIRE_NAME} <hr>
//         County: ${fire.COUNTY} <br>
//         Discovery Date: ${fire.DISCOVERY_DATE} <br>
//         Fire Size: ${fire.FIRE_SIZE} Acres`;
//       fireCircles.push(
//         L.circle([fire.LATITUDE, fire.LONGITUDE], {
//           color: chooseColor(fire.FIRE_SIZE_CLASS),
//           fillColor: chooseColor(fire.FIRE_SIZE_CLASS),
//           fillOpacity: 0.5,
//           radius: fire.FIRE_SIZE * 10000
//         }).bindPopup(fireInfo)
//       );
//     }
//   });
//
//   // Create a layer group with the earthquake circles and output as function return
//   var fireInstances = L.layerGroup(fireCircles);
//   return fireInstances;
// }

d3.csv("data/us-wildfires.csv").then(function(data) {

  console.log(data);
  var states = [];
  data.forEach(fire=> {
    if(!states.includes(fire.STATE)) {
      states.push(fire.STATE);
    }
  });
  states = states.sort();
  console.log(`Here are the states ${states}`);
  console.log(states.length);

  // Add ids to dropdown menu
  var dropDown = d3.select("#selDataset");
  states.forEach(function(abbrev) {
    dropDown.append("option")
      .attr("value", abbrev)
      .text(abbrev);
  });

  // Set up event for dropdown and form
  var dropdown = d3.select("#selDataset");
  var form = d3.select("#form");

  dropdown.on("change", genCharts);
  form.on("submit", genCharts);

  var parseDate = d3.timeParse("%Y-%m-%d");


  function genCharts() {
    d3.event.preventDefault();

    // Get selected state abbreviation
    var currentState = d3.select("#selDataset").node().value;
    console.log(currentState);

    //  Bar Chart
    // ***********************************

    // Filter for selected state
    var currentStateData = data.filter(d => d.STATE === currentState);
    console.log(currentStateData);
    console.log("finished filter");
    currentStateData.forEach(d => {
      d.FIRE_SIZE = +d.FIRE_SIZE;
      d.FIRE_YEAR = +d.FIRE_YEAR;
      d.LATITUDE = +d.LATITUDE;
      d.LONGITUDE = +d.LONGITUDE;
      d.COUNTY = d.COUNTY.toLowerCase();
      d.DISCOVERY_DATE = parseDate(d.DISCOVERY_DATE);
    });

    // Create function to count by class
    function dataCounter(stateData, column) {
      // Dictionary to hold output
      var finalCounts = {};

      let fireValues = [],
        fireValueCount = [],
        classes = stateData.map(d => d[column]).sort(),
        previousElement;
      console.log(classes)

      classes.forEach(currentElement => {
        if (currentElement === "na") {

        }
        else if (currentElement !== previousElement) {
          fireValues.push(currentElement);
          fireValueCount.push(1);
          previousElement = currentElement;
        }
        else {
          fireValueCount[fireValueCount.length - 1]++;
          previousElement = currentElement;
        }
      });

      finalCounts.values = fireValues;
      finalCounts.counts = fireValueCount;
      return finalCounts;
    }

    var stateCounts = dataCounter(currentStateData, 'FIRE_SIZE_CLASS');
    console.log(stateCounts);

    // Create components to graph with plotly
    var traceBar = {
      x: stateCounts.values,
      y: stateCounts.counts,
      type: "bar",
      text: stateCounts.counts.map(String),
      textposition: 'auto',
      marker: {
        color: 'rgb(255,153,51)',
        opacity: 0.6,
        line: {
          color: 'rgb(8,48,107)',
          width: 1.5
        }
      }
    };

    var barData = [traceBar];

    var barLayout = {
      title: `Fires by Class in ${currentState}`
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Bar Plot Number 2

    var countyCounts = dataCounter(currentStateData, 'COUNTY');
    console.log(countyCounts);

    // Transform into a dictionary
    var topCounties = [];
    for(var i = 0; i < countyCounts.counts.length; i++) {
      var tempDict = {};
      tempDict.county = countyCounts.values[i];
      tempDict.fireCount = countyCounts.counts[i];
      topCounties.push(tempDict);
    }

    // Get top 10 counties by fire count
    var topTenCounties  = topCounties.sort(function compareFunction(first, second) {
      return second.fireCount - first.fireCount;
    });

    topTenCounties = topTenCounties.slice(0,10);

    // Create components to graph with plotly
    var traceBar = {
      x: topTenCounties.map(d => d.county),
      y: topTenCounties.map(d => d.fireCount),
      type: "bar",
      text: topTenCounties.map(d => d.fireCount).map(String),
      textposition: 'auto',
      marker: {
        color: 'rgb(255,153,51)',
        opacity: 0.6,
        line: {
          color: 'rgb(8,48,107)',
          width: 1.5
        }
      }
    };

    var barData2 = [traceBar];

    var barLayout2 = {
      title: `Top 10 Counties by Fire Count in ${currentState}`
    };

    Plotly.newPlot("bar2", barData2, barLayout2);
    // Bubble Chart
    // ***********************************
    // Create trace and layout
    var bubbleScale = 15;
    var traceBubble = {
      x : currentStateData.map(d => d.FIRE_YEAR),
      y : currentStateData.map(d => d.FIRE_SIZE),
      mode: "markers",
      text: currentStateData.map(d => d.FIRE_NAME),
      marker: {
        size: currentStateData.map(d => d.FIRE_SIZE),
        color: currentStateData.map(d => d.FIRE_SIZE),
        sizeref: 2.0 * Math.max(...currentStateData.map(d => d.FIRE_SIZE)) / (bubbleScale**2),
      }
    };
    var bubbleLayout = {
      title: `Fire Sizes by Year in ${currentState}`,
      xaxis: {title: "Fire Year"}
    };

    var bubbleData = [traceBubble];

    // Create bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Select coordinates for starting map view
    // d3.select("#map").html("");
    // var startingCoords = [currentStateData[0].LATITUDE, currentStateData[0].LONGITUDE];
    // var mapZoomLevel = 5;
    // console.log(startingCoords);
    //
    // var fires2011 = createCircles(currentStateData, 2011);
    // var fires2012 = createCircles(currentStateData, 2012);
    // var fires2013 = createCircles(currentStateData, 2013);
    // var fires2014 = createCircles(currentStateData, 2014);
    // var fires2015 = createCircles(currentStateData, 2015);
    //
    // var annualFireLayers = [fires2011, fires2012, fires2013, fires2014, fires2015];
    // createMap(startingCoords, mapZoomLevel, annualFireLayers);
    // console.log("created map");
  }


});

console.log("hello");
