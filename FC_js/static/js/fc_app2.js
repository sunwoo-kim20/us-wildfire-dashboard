//(A=greater than 0 but less than or equal to 0.25 acres, B=0.26-9.9 acres, C=10.0-99.9 acres, D=100-299 acres, E=300 to 999 acres, F=1000 to 4999 acres, and G=5000+ acres).

// Define SVG area dimensions
// ==============================
var svgWidth = 960;
var svgHeight = 650;

var margin = {
  top:60,
  right:40,
  bottom: 60,
  left:100
};


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Select body, append SVG area to it, and set the dimensions
// ==============================
var svg = d3.select("#chart1")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)



// Append an SVG group
// ==============================
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Load data from us-widlfires.csv
// ==============================
d3.csv("data/us-wildfires.csv").then(function(fireData) {
  
  //console.log("fireData", fireData);
  //console.table(fireData[0]);

  var sum = d3.nest()
  .key(function(d) { return d.FIRE_YEAR; }).sortKeys(d3.ascending)
  .rollup(function(values) { return d3.sum(values, function(d) {return +d.FIRE_SIZE; }) })
  .entries(fireData)

 //console.log(sum[0]);

 //console.table(sum);

var num_fires_year = d3.nest()
  
  .key(function(d) { return d.FIRE_YEAR; }).sortKeys(d3.ascending)
   
  .rollup(function(v) { return v.length; })
  .entries(fireData)

console.table(num_fires_year);

var fires_scale = d3.nest()
  .key(function(d) { return d.FIRE_YEAR; }).sortKeys(d3.ascending)
  .key(function (d) { return d.FIRE_SIZE_CLASS; }).sortKeys(d3.ascending)
  .key(function(d) { return d.FIRE_YEAR; }).sortKeys(d3.ascending)

  .rollup(function(v) { return v.length; })
  .entries(fireData)

console.log(fires_scale);
console.table(fires_scale)
  
var fires_class = d3.nest()
  
  .key(function (d) { return d.FIRE_SIZE_CLASS; }).sortKeys(d3.ascending)
  .rollup(function(v) { return v.length; })
  .entries(fireData)

  console.table(fires_class)
  })

/*var data = [
  {"year": 2011, "A": 28677, "B":46523 , "C":11634, "D":1854 ,"E":985, "F":605, "G":274 },
  {"year": 2012, "A": 27349, "B":34977 , "C":7960 , "D":1182 ,"E":642, "F":415, "G":244 },
  {"year": 2013, "A": 28004, "B":29624 , "C":5855 , "D":677 , "E":301, "F":187, "G":132},
  {"year": 2014, "A": 27260, "B":31724 , "C":7216 , "D":865 , "E":371, "F":214, "G":103 },
  {"year": 2015, "A": 32347, "B":32130 , "C":7720 , "D":1098 ,"E":568, "F":336, "G":292 },
  
];
*/

d3.csv("data/result.csv").then(function(data) { 
  
  console.log(data)


var keys = data.columns.slice(1)

var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet1);
  
var stackedData = d3.stack()
  .keys(keys)
  (data) 

// Create scale functions
var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([0, width]);

var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5))


// Create  X & Y axes labels
chartGroup.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+40 )
      .text("Year");

chartGroup.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -30 )
      .text("Num of Fires by Fire Class")
      .attr("text-anchor", "start")

// Add Y axis
var y = d3.scaleLinear()
    .domain([0,120000])
    .range([height, 0])
chartGroup.append("g")
    .call(d3.axisLeft(y).ticks(5));

 
 
 //bushing and chart
var clip = chartGroup.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

// Add brushing
var brush = d3.brushX()                
      .extent( [ [0,0], [width,height] ] ) 
      .on("end", updateChart) 

// Create the scatter variable: 
var areaChart = chartGroup .append('g')
    .attr("clip-path", "url(#clip)")

// Area generator
var area = d3.area()
    .x(function(d) { return x(d.data.year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1] ); })

// Show the areas
areaChart.selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)

// Add the brushing
areaChart.append("g")
      .attr("class", "brush")
      .call(brush);

var idleTimeout 
function idled() { idleTimeout = null; }


function updateChart() {

    extent = d3.event.selection

      if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); 
      x.domain(d3.extent(data, function(d) { return d.year; }))
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      areaChart.select(".brush").call(brush.move, null) 
    }

    
xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
    areaChart
      .selectAll("path")
      .transition().duration(1000)
      .attr("d", area)
    }

//Hightlight group
   
var highlight = function(d){
     console.log(d)
      
  d3.selectAll(".myArea").style("opacity", .1)
      
  d3.select("."+d).style("opacity", 1)
    }

   
var noHighlight = function(d){
  d3.selectAll(".myArea").style("opacity", 1)
    }
  

// Legend
var size = 15
chartGroup.selectAll("myrect")
      .data(keys)
      .enter()
      .append("rect")
        .attr("x", 825)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) 
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

// Add one dot in the legend for each name.
chartGroup.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 825 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) 
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)



d3.select("#circleBasicTooltip")
  .on("mouseover", function(){return tooltip.style("visibility", "visible");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-800)+"px").style("left",(event.pageX-800)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});


 }).catch(function(error) {
  console.log(error);
});


// scatter map

d3.csv('data/bigfire.csv', function(err, rows){
  function filter_and_unpack(rows, key, year) {
    return rows.filter(row => row['FIRE_YEAR'] == year).map(row => row[key])
    }

  var frames = []
  var slider_steps = []

  var n = 4;
  var num = 2011;
  for (var i = 0; i <= n; i++) {
    var logsize = filter_and_unpack(rows, 'LOG_FIRE_SIZE', num)
    var cause = filter_and_unpack(rows, 'STAT_CAUSE_DESCR', num)
    var lon = filter_and_unpack(rows, 'LONGITUDE', num)
    var lat = filter_and_unpack(rows, 'LATITUDE', num)
    var size = filter_and_unpack(rows, 'FIRE_SIZE', num)
    frames[i] = {data: [{logsize: logsize, size: size, lon: lon, lat: lat, text: cause}], name: num}
    console.log(frames[0].data[0].size)
    slider_steps.push ({
        label: num.toString(),
        method: "animate",
        args: [[num], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300}
          }
        ]
      })
    num = num + 1
  }

    var data = [{
        type: 'scattergeo',
        mode: 'markers',
        text: frames[0].data[0].size,
        meta: frames[0].data[0].text,
        lon: frames[0].data[0].lon,
        lat: frames[0].data[0].lat,
        hovertemplate: `<b>Fire Size: %{text} acres </b><br>` +
        `<b>%{meta}</b>`+
        `<extra></extra>`,
        marker: {
          color: frames[0].data[0].logsize,
          colorscale: 'YlOrRd',
          cmin: 2,
          cmax: 14,
          reversescale: true,
          opacity: 1,
          size: 4,
          colorbar:{
            thickness: 10,
            titleside: 'right',
            outlinecolor: 'rgba(68,68,68,0)',
            ticks: 'outside',
            ticklen: 3,
            shoticksuffix: 'last',
            title: ' Fire Size (log2 acres) ',
            dtick: 2
          }
        },
        name: 'Fire'
    }];
    
    var layout = {
      geo:{
        scope: 'usa',
        showland: true,
        landcolor: 'rgb(212,212,212)',
        subunitcolor: 'rgb(255,255,255)',
        countrycolor: 'rgb(255,255,255)',
        showlakes: true,
        lakecolor: 'rgb(255,255,255)',
        showsubunits: true,
        showcountries: true,
        resolution: 50,
        projection: {type: 'albers usa'}
      },
      title: 'US Fire Size from 2011 to 2015',
      width: 1000,
      height: 750,
      zoom: 20,
      updatemenus: [{
        x: 0.1,
        y: 0,
        yanchor: "top",
        xanchor: "right",
        showactive: false,
        direction: "left",
        type: "buttons",
        pad: {"t": 87, "r": 10},
        buttons: [{
          method: "animate",
          args: [null, {
            fromcurrent: true,
            transition: {
              duration: 200,
            },
            frame: {
              duration: 500
            }
          }],
          label: "Play"
        }, {
          method: "animate",
          args: [
            [null],
            {
              mode: "immediate",
              transition: {
                duration: 0
              },
              frame: {
                duration: 0
              }
            }
          ],
          label: "Pause"
        }]
      }],
      sliders: [{
        active: 0,
        steps: slider_steps,
        x: 0.1,
        len: 0.9,
        xanchor: "left",
        y: 0,
        yanchor: "top",
        pad: {t: 50, b: 10},
        currentvalue: {
          visible: true,
          prefix: "Year:",
          xanchor: "right",
          font: {
            size: 20,
            color: "#666"
          }
        },
        transition: {
          duration: 300,
          easing: "cubic-in-out"
        }
      }]
    };

    Plotly.newPlot('chart4', data, layout).then(function() {
      Plotly.addFrames('chart4', frames);
  });
})