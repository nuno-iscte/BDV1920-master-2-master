'use strict';

// with strict mode, you can not, for example, use undeclared variables
// visualization will be hold in the div with id=vis1_id

// set the dimensions and margins of the graph
const margin = { top: 20, right: 100, bottom: 30, left: 30 };
const width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var parseTime = d3.parseTime("%m-%d-y")

// ex. of data: [{day: "04-23-20", cases: 84, deaths: 4, country: "Afghanistan"}, ...]

function drawMultiseries(data) {

  console.log(data)

  // append the svg object to the body of the page
  var svg = d3.select("body").select("#vis1_id")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // list of groups (one group per column)
  var groups = ["Portugal", "Spain", "France", "Germany"]

  // reformat the data: we need an array of arrays of {x, y} tuples

  // TODO: optimize code to be faster
  var dataReady = groups.map(name => { 
    let values = []
    data.forEach(d => {
      if (d.country == name) {
        values.push({time: parseTime(d.day), value: +d.cases})
      }
    })
    return {
      name: name,
      values: values
    }
  })

  // have a look at dataReady
  console.log(dataReady)

  // color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  // X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Y axis
  var y = d3.scaleLinear()
    .domain([0, 20])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // lines
  var line = d3.line()
    .x(function (d) { return x(+d.time) })
    .y(function (d) { return y(+d.value) })
  svg.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("class", function (d) { return d.name })
    .attr("d", function (d) { return line(d.values) })
    .attr("stroke", function (d) { return myColor(d.name) })
    .style("stroke-width", 4)
    .style("fill", "none")

  // points
  svg
    // first we need to enter in a group
    .selectAll("myDots")
    .data(dataReady)
    .enter()
    .append('g')
    .style("fill", function (d) { return myColor(d.name) })
    .attr("class", function (d) { return d.name })
    // second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data(function (d) { return d.values })
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.time) })
    .attr("cy", function (d) { return y(d.value) })
    .attr("r", 5)
    .attr("stroke", "white")

  // label at the end of each line
  svg
    .selectAll("myLabels")
    .data(dataReady)
    .enter()
    .append('g')
    .append("text")
    .attr("class", function (d) { return d.name })
    .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; }) // keep only the last value of each time series
    .attr("transform", function (d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
    .attr("x", 12) // shift the text a bit more right
    .text(function (d) { return d.name; })
    .style("fill", function (d) { return myColor(d.name) })
    .style("font-size", 15)

  // legend (interactive)
  svg
    .selectAll("myLegend")
    .data(dataReady)
    .enter()
    .append('g')
    .append("text")
    .attr('x', function (d, i) { return 30 + i * 60 })
    .attr('y', 30)
    .text(function (d) { return d.name; })
    .style("fill", function (d) { return myColor(d.name) })
    .style("font-size", 15)
    .on("click", function (d) {
      // is the element currently visible ?
      currentOpacity = d3.selectAll("." + d.name).style("opacity")
      // change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0 : 1)
    })

}
