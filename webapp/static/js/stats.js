'use strict';
// with strict mode, you can not, for example, use undeclared variables

// Note: visualization will be put in the div with id=vis1_id



// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#vis1_id")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


          
//Formatação da data que chega em string mes/dia/ano
var parseTime = d3.timeParse('%m/%_d/%y')

var originalData;

var time =1000;

var allGroup = [];//[Portugal", "Spain", "Italy", "France"]

var country = 'QT_MORTOS';

d3.select("#selectTime").on("change", function(d) {
    // recover the option that has been chosen
    time = d3.select(this).property("value")
})

// Função para preencher o array de paises
function setCountryList(data){
    //data = d3.entries(data);

    data.forEach(elemet => {
        allGroup.push(elemet.key)
    });
}


function drawData(data) {
    
    setCountryList(data);

    originalData = data;
    
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    updateData(data[country]);
    
}

function setData(data){
    var dlist = d3.entries(data)
    

    // format the data
    dlist.forEach(function(d) {
        d.key = parseTime(d.key);
        d.value = +d.value;
    });

    console.log(dlist);
    return dlist;
}

function set_xAxis(dlist){
    var x = d3.scaleTime()
        .domain(d3.extent(dlist, function(d) { return d.key; }))
        .range([ 0, width ]);

    return x
}

function set_yAxis(dlist){
    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(dlist, function(d) { return +d.value; })])
    .range([ height, 0 ]);
    

    return y;
}

function updateData(data){
    
    var dlist = setData(data);

    var x = set_xAxis(dlist);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var y = set_yAxis(dlist);

    svg.append("g")
    .call(d3.axisLeft(y));
    
    
    var line = svg
        .append('g')
        .append("path")
        .datum(dlist)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.key) })
          .y(function(d) { return y(+d.value) })
        )
        .attr("stroke", "steelblue")
        .style("stroke-width", 4)
        .style("fill", "none")

        
        svg.append('text')
        .attr('x', (width / 2))
        .attr("y", 0 - (margin.top - 20))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("fill", "black")
        .text("Confirmed");

        function update(dlist){
            dlist = setData(dlist)
           
            y = set_yAxis(dlist);
                 
            svg.transition()
                .duration(time)
                .call(d3.axisLeft(y));

            x = set_xAxis(dlist);
                
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            line
                .datum(dlist)
                .transition()
                .duration(time)
                .attr("d", d3.line()
                .x(function(d) { return x(+d.key) })
                .y(function(d) { return y(+d.value) })
                )
        }

    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        country = selectedOption;
        
        update(originalData[country])
    })
}