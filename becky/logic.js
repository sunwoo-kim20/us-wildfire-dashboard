var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  // .selectAll("svg")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "Year";


d3.csv("data/us-wildfires.csv").then(function(data) {
    console.log(data);

  var fireDate = d3.nest()
    .key(function (d) {return d.DISCOVERY_DATE; })
    // .key(function(d) {return d.STAT_CAUSE_DESCR; })
    .rollup(function(d) {return d.FIRE_SIZE; })
    .entries(data)
  

  var discoverFire = data.map(function(fires) {
      return fires.DISCOVERY_DATE;
    });

  var fireName = d3.nest()
    .key(function(d) {return d.FIRE_NAME; })
    .key(function(d) {return d.FIRE_SIZE; })
    // .map(data, d => d.FIRE_SIZE)
    .entries(data)
 
  var fireCause = data.map(function(fires) {
    return fires.STAT_CAUSE_DESCR;
    });
    
  var fireSize = d3.nest()
    .key(function(d) {return d.FIRE_SIZE; }) 
    .entries(data)
 
  var fireYear = d3.nest()
    .key(function(d) {return d.FIRE_YEAR; })
    .entries(data)

  console.table(discoverFire);
 
  var minDate = d3.min(data, d => d.DISCOVERY_DATE);
  var maxDate = d3.max(data, d => d.DISCOVERY_DATE);
  console.log(minDate);
  console.log(maxDate);

  // // Scatter Plot 
    var xTimeScale = d3.scaleLinear()
    // var xTimeScale = d3.scaleTime()
    // .domain(d3.extent(data, d => d.DISCOVERY_DATE))
    .domain([minDate, maxDate])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(fireSize, d => d.key)])
    .range([height, 0]);

   // create axes
    var xAxis = d3.axisBottom(xTimeScale);
      // .ticks(5)
      // .tickFormat(d => xTimeScale(d.DISCOVERY_DATE));

    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`).call(xAxis);
  
    chartGroup.append("g").call(yAxis);

    // // // append initial circles
    // var circlesGroup = chartGroup.selectAll("circle")
    chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xTimeScale(d.DISCOVERY_DATE))
      .attr("cy", d => yLinearScale(fireSize.key))
      .attr("r", 10)
      .attr("fill", "pink")
      .attr("opacity", ".5");

      // var toolTip = d3.select("body")
      // .append("div")
      // .classed("tooltip", true);

    // // Step 2: Create "mouseover" event listener to display tooltip
    // circlesGroup.on("mouseover", function(d) {
    //   toolTip.style("display", "block")
    //       .html(
    //         `<strong>${dateFormatter(d.date)}<strong><hr>${d.medals}
    //     medal(s) won`)
    //       .style("left", d3.event.pageX + "px")
    //       .style("top", d3.event.pageY + "px");
    // })
    //   // Step 3: Create "mouseout" event listener to hide tooltip
    //   .on("mouseout", function() {
    //     toolTip.style("display", "none");
    // //   });

});



