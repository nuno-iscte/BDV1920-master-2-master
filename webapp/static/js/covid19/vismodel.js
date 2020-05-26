'use strict';

// with strict mode, you can not, for example, use undeclared variables
// visualization will be held in the div with id=vis1_id

// set the dimensions and margins of the graph
const margin = { top: 30, right: 300, bottom: 30, left: 60 };
const width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// ex. of data: [[{day: "04-23-20", cases: 84, deaths: 4, country: "Afghanistan"}, ...]]

function drawMultiseries(data) {

  //console.log(data)
  const dd = data[0]
  const mydata = dd[0]
  //console.log(mydata)

  var parser = d3.timeParse("%m-%d-%y")

  // append the svg object to the body of the page
  var svg = d3.select("body").select("#vis1_id")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // list of groups (one group per column)
  var groups = ["Portugal", "Spain", "France", "Italy", "Germany"]

  // reformat the data as we need 
  // [
  //  {name: 'Portugal', values: [{time:, value:}, {...}]}, 
  //  {...}
  // ] 

  let auxdata = {}
  let max = 0
  let dayfrom = parser("01-01-21"),
    dayto = parser("01-01-18")
  mydata.forEach(d => {
    if (groups.includes(d.country)) {
      const day = parser(d.day)
      const tup = { time: day, value: +d.cases }
      if (max < +d.cases) {
        max = +d.cases
      }
      if (dayfrom > day) {
        dayfrom = day
      } else if (dayto < day) {
        dayto = day
      }
      if (auxdata[d.country]) {
        auxdata[d.country].push(tup)
      } else {
        auxdata[d.country] = [tup]
      }
    }
  })

  let dataReady = Object.keys(auxdata).map(c => {
    return { name: c, values: auxdata[c] }
  })
  // have a look at data
  //console.log(dataReady, dayfrom, dayto)

  // color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(groups)
    .range(d3.schemeSet2);

  // X axis --> it is a time format
  const x = d3.scaleTime()
    .range([0, width])
    .domain([dayfrom, dayto])

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Y axis
  var y = d3.scaleLinear()
    .domain([0, max])
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
    .style("stroke-width", 2)
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
    .attr("r", 3)
    .attr("stroke", "white")

  // legend
  svg
    .selectAll("myLegend")
    .data(dataReady)
    .enter()
    .append('g')
    .append("text")
    .attr('x', 30)
    .attr('y', function (d, i) { return 30 + i * 30 })
    .text(function (d) { return d.name; })
    .style("fill", function (d) { return myColor(d.name) })
    .style("font-size", 15)

}