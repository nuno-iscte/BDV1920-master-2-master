// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 70, left: 110},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Formatação da data que chega em string mes/dia/ano
var parseTime = d3.timeParse('%m/%_d/%y')


// Create data
function drawData(data){
    data.sort(function (a, b){
        return b.N_Acidentes - a.N_Acidentes;
    })
  updateData(data);
}

function updateData(data){
  console.log(data);

  // Add Y axis 
  var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.DESC_DISTRITO; }))
    .range([ 0, width ])
    .padding(0.2);
  xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.N_Acidentes; }))
    .range([ height, 0 ])
  yAxis = svg.append("g")
    .call(d3.axisLeft(y));
  
  
  svg.append('text')
    .attr('x', (width / 2))
    .attr("y", 0 - (margin.top - 20))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .style("fill", "black")
    .text("Vehicle Type");

    //Bars
  svg.selectAll("myRect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", function(d) { return x(d.DESC_DISTRITO); })
      .attr("y", function(d) { return y(d.N_Acidentes); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.N_Acidentes); })
      .attr("fill", "#69b3a2")
}