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

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
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

  let dateParser = d3.timeParse("%y-%m-%d");
  const parseYear = d3.timeParse("%Y");
    
  // // var yearParser = d3.timeParse("%y");
    // parse data
  // data.forEach(function(d) {
  //     d.FIRE_YEAR = parseYear(d.FIRE_YEAR);
  // });

  // data.forEach(function(d) {
  //   d.DISCOVERY_DATE =dateParser(d.DISCOVERY_DATE);
  // });
    
  var fireDate = d3.nest()
    .key(function (d) {return d.DISCOVERY_DATE; })
    // .key(function(d) {return d.STAT_CAUSE_DESCR; })
    .rollup(function(d) {return d.FIRE_SIZE; })
    .entries(data)
  
  // var fireYear = d3.map(function(fires) {
  //   return fires.CONT_DATE;
  // });

  // var fireYear = fireDate.getFullYear()

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
    var xLinearScale = d3.scaleTime()
    // var xLinearScale= d3.scaleLinear()
    // .domain(d3.extent(data, d => d.DISCOVERY_DATE))
    .domain([minDate, maxDate])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.FIRE_SIZE)])
    .range([height, 0]);

   // create axes
    var xAxis = d3.axisBottom(xLinearScale)
      .ticks(5)
      .tickFormat(d => xLinearScale(d.DISCOVERY_DATE));

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
      .attr("cx", d => xLinearScale(d.DISCOVERY_DATE))
      .attr("cy", d => yLinearScale(fireSize.key))
      .attr("r", 10)
      .attr("fill", "pink")
      .attr("opacity", ".5");

      var toolTip = d3.select("body")
      .append("div")
      .classed("tooltip", true);




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

     // Bar Chart
    
     var xBandScale = d3.scaleBand()
     .domain(data.map(d => d.DISCOVERY_DATE))
     .range([0, width])
     .padding(0.1);
 
   // Create a linear scale for the vertical axis.
   var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(data, d => d.FIRE_SIZE)])
     .range([chartHeight, 0]);
 
   // Create two new functions passing our scales in as arguments
   // These will be used to create the chart's axes
   var bottomAxis = d3.axisBottom(xBandScale);
   var leftAxis = d3.axisLeft(yLinearScale).ticks(10);
 
   // Append two SVG group elements to the chartGroup area,
   // and create the bottom and left axes inside of them
   chartGroup.append("g")
     .call(leftAxis);
 
   chartGroup.append("g")
     .attr("transform", `translate(0, ${chartHeight})`)
     .call(bottomAxis);
 
   // Create one SVG rectangle per piece of tvData
   // Use the linear and band scales to position each rectangle within the chart
   chartGroup.selectAll(".bar")
     .data(tvData)
     .enter()
     .append("rect")
     .attr("class", "scatter")
     .attr("x", d => xBandScale(d.DISCOVERY_DATE))
     .attr("y", d => yLinearScale(d.FIRE_SIZE))
     .attr("width", xBandScale.bandwidth())
     .attr("height", d => chartHeight - yLinearScale(d.hours));

});







