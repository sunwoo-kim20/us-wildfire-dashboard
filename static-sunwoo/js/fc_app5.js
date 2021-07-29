//bar chart for fire causes

var svgWidth = 960;
var svgHeight = 550;

var margin = {
  top:80,
  right:40,
  bottom: 110,
  left:120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart3").classed('chart3', true)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  


d3.csv("data/causes_result.csv").then( function(data) {

 
  var subgroups = data.columns.slice(1)

  
  var groups = data.map(d => d.Year)

  console.log(groups)

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
 var y = d3.scaleLinear()
    .domain([0, 20000])
    .range([ height, 0 ]);
  
  chartGroup.append("g")
    .call(d3.axisLeft(y))
   
  
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeSet1);

 chartGroup.append("g")
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", d => `translate(${x(d.Year)}, 0)`)
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .join("rect")
      .attr("x", d => xSubgroup(d.key))
      .attr("y", d => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key))
      .on('mouseover', function (d, i) {
          tooltip
            .html(
              `<div>${d.key}</div><hr> ${d.value}</div>`
            )
            .style('visibility', 'visible');
          
      })
      .on('mousemove', function () {
          tooltip
            .style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
          tooltip.html(``).style('visibility', 'hidden');
          
      });


// Label
chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("text-anchor", "middle")
      .style("font-weight" , "bold")
      .text("Number of Fires by Causes");

chartGroup.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+40 )
      .text("Year");

tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3-tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('padding', '8px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff')
    .text('a simple tooltip');

// Add Legend
var legend = chartGroup.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(subgroups.slice())
    .enter().append("g")
      .attr("transform", function( d, i) { return "translate(0," + i* 20 + ")"; });

 legend.append("rect")
      .attr("x", width - 1)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color);

  legend.append("text")
      .attr("x", width - 5)
      .attr("y", 9.5)
      .attr("dy", "0.50em")
      .text(function(d) { return d; });

 }).catch(function(error) {
  console.log(error);
})