// Use D3 to read data from json file
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

  function genCharts() {
    d3.event.preventDefault();

    // Get selected state abbreviation
    var currentState = d3.select("#selDataset").node().value;
    console.log(currentState);

    // Horizontal Bar Chart
    // ***********************************

    // Filter for selected state
    var currentStateData = data.filter(d => d.STATE === currentState);
    console.log(currentStateData);
    console.log("finished filter");
    currentStateData.forEach(d => {
      d.FIRE_SIZE = +d.FIRE_SIZE;
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
        if (currentElement !== previousElement) {
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

    // Create components to graph with plotly
    var traceBar = {
      x: countyCounts.values,
      y: countyCounts.counts,
      type: "bar",
      text: countyCounts.counts.map(String),
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
      title: `Top 10 Fire Countes by County in ${currentState}`
    };

    Plotly.newPlot("chart2", barData2, barLayout2);
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
  }


});

console.log("hello");
