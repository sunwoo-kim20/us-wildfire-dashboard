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


    // Sort Data by largest fire for table
    var sortedFire = currentStateData.sort(function compareFunction(first, second) {
      return second.FIRE_SIZE - first.FIRE_SIZE;
    });
    var largestFire = sortedFire[0];

    // Add info to table
    var metadataDisplay = d3.select("#sample-metadata");
    metadataDisplay.html("");
    metadataDisplay.append("p")
      .attr("style", "font-weight : bold").text(`Total Fires : ${currentStateData.length}`);
    metadataDisplay.append("p")
      .attr("style", "font-weight : bold").text(`Largest Fire in ${currentState}`);
    metadataDisplay.append("hr");
    metadataDisplay.append("p")
      .attr("style", "font-weight : bold").text(`Fire Name : ${largestFire.FIRE_NAME}`);
    metadataDisplay.append("p")
      .attr("style", "font-weight : bold").text(`County : ${largestFire.COUNTY}`);
    metadataDisplay.append("p")
      .attr("style", "font-weight : bold").text(`Fire Size : ${largestFire.FIRE_SIZE} acres`);
    metadataDisplay.append("p")
      .attr("style", "font-weight : bold").text(`Fire Size Class : ${largestFire.FIRE_SIZE_CLASS}`);
    metadataDisplay.append("p")
      .attr("style", "font-weight : bold").text(`Year : ${largestFire.FIRE_YEAR}`);


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
      x : currentStateData.map(d => d.DISCOVERY_DATE),
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

  }


});
