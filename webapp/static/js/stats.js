// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 30, left: 50},
    width = 850 - margin.left - margin.right,
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

  var allGroup =['QT_MORTOS', 'QT_FGRAVES', 'QT_FLIGEIROS']

  d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })

  updateData(data);
}

function updateData(data){
  console.log(data);

 

  // format the data
  data.forEach((d) => {
    d.DataAcidente = parseTime(d.DataAcidente);
    d.QT_MORTOS = +d.QT_MORTOS;
    d.QT_FGRAVES = +d.QT_FGRAVES;
    d.QT_FLIGEIROS = +d.QT_FLIGEIROS;
  });
  
  //Ordenação do array por ordem de datas
  data = data.sort((a,b) => b.DataAcidente - a.DataAcidente);

  console.log('Data2:' , data)
  data = data[0];
  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.DataAcidente; }))
    .range([ 0, width ]);
  xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.QT_MORTOS; })])
    .range([ height, 0 ]);
  yAxis = svg.append("g")
    .call(d3.axisLeft(y));
  
  
  svg.append('text')
    .attr('x', (width / 2))
    .attr("y", 0 - (margin.top - 20))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .style("fill", "black")
    .text("QT_MORTOS");

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    var line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Add the line
    line.append("path")
      .datum(data)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .attr("d", d3.line()
        .x(function(d) { return x(d.DataAcidente) })
        .y(function(d) { return y(d.QT_MORTOS) })
        )

    // Add the brushing
    line
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line
          .select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.DataAcidente) })
            .y(function(d) { return y(d.QT_MORTOS) })
          )
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick",function(){
      x.domain(d3.extent(data, function(d) { return d.DataAcidente; }))
      xAxis.transition().call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(d.DataAcidente) })
          .y(function(d) { return y(d.QT_MORTOS) })
      )
    });
}