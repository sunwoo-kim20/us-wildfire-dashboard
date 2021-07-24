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

});

console.log("hello");
