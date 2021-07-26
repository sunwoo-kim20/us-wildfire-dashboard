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

    // Create function to count by class
    function classCounter(stateData) {
      // Dictionary to hold output
      var finalCounts = {};

      let fireClasses = [],
        fireClassCount = [],
        classes = stateData.map(d => d.FIRE_SIZE_CLASS).sort(),
        previousElement;
      console.log(classes)

      classes.forEach(currentElement => {
        if (currentElement !== previousElement) {
          fireClasses.push(currentElement);
          fireClassCount.push(1);
          previousElement = currentElement;
        }
        else {
          fireClassCount[fireClassCount.length - 1]++;
          previousElement = currentElement;
        }
      });

      finalCounts.classes = fireClasses;
      finalCounts.counts = fireClassCount;
      return finalCounts;
    }

    var stateCounts = classCounter(currentStateData);
    console.log(stateCounts);

    // Create components to graph with plotly
    var traceBar = {
      x: stateCounts.classes,
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

  }






  // Bubble Chart
  // ***********************************
});

console.log("hello");
