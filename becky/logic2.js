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
  .select("#line")
  // .selectAll("svg")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/us-wildfires.csv").then(function(data) {
    console.log(data);

  var dateParser = d3.timeParse("%Y-%m-%d");

  // data.forEach(function(d) {
  //   d.DISCOVERY_DATE =dateParser(d.DISCOVERY_DATE);
  // });
    
     // Lne Chart
     var minDate = d3.min(data, d => d.DISCOVERY_DATE);
     var maxDate = d3.max(data, d => d.DISCOVERY_DATE);

  var fireClass = d3.nest()
    .key(function(d) {return d.DISCOVERY_DATE;}).sortKeys(d3.ascending)
    .key(function(d) {return d.FIRE_SIZE_CLASS;})
    // .rollup(function(fires) {return fires.length})
    .entries(data);

    var minDate = d3.min(fireClass, d => d.key);
    var maxDate = d3.max(fireClass, d => d.key);
    var yMax = d3.max(fireClass, d => d.key.key);
    // console.log(minDate);
    console.log(yMax);
    console.log(fireClass);
   
    //  // Axis
  var x = d3.scaleLinear()
     .range([0, width] )
     .domain([minDate, maxDate]);
  
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
    .ticks(5));
  
  var y = d3.scaleLinear()
   .domain([0, d3.max(fireClass, function(d) {return d.values.values;}) ])
   .range([height, 0]);
  
  svg.append("g")
     .call(d3.axisLeft(y));
 
  //  var res = fireClass.map(function(d) {return d.key})
   var color =  d3.scaleOrdinal()
   .domain(fireClass, function(d) {return d.key.key})
   .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33', '#a65628'])
  
   svg.selectAll(".line")
     .data(fireClass)
     .enter()
     .append("path")
       .attr("fill", "none")
       .attr("stroke", function(d){ return color(d.key) })
       .attr("stroke-width", 1.5)
       .attr("d", function(d){
         return d3.line()
           .x(function(d) { return x(d.key); })
           .y(function(d) { return y(+d.values.n); })
           (d.values.values)
       })

});



