'use strict';

// visualization will be held in the div with id=vis2_id
const margin2 = { top: 30, right: 300, bottom: 30, left: 60 };
const width2 = 1000 - margin2.left - margin2.right,
    height2 = 600 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
// as div must have height
// we could have set it directly in the div
// ... but we still may want to use anyway. For example,
// to add extra d3 visualization
var svgmap = d3.select("body").select("#vis2_id")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin2.left + "," + margin2.top + ")");

// the map
var mapcentre = [38.72, -9.15], zoom = 4, max_zoom = 20;
var mymap = L.map("vis2_id").setView(mapcentre, zoom);

// the scale for markers
var radiusScale = d3.scaleLog()
    .domain([1, 10000])
    .range([3, 80]);

// the parser
var parser = d3.timeParse("%m-%d-%y")

/////////////////////////////////

function drawMap(data) {

    // add lat, lng as it was not provided from the server side
    // could have been done differently
    const dd = data[0]
    let geolocation = {}
    dd[1].forEach(d => {
        geolocation[`${d.geoID}`] = [d.lat, d.lng]
    })
    let mydata = dd[0].map(d => {
        const geoID = d['geoID']
        const loc = geolocation[geoID] || [0, 0]
        return { ...d, lat: loc[0], lng: loc[1] }
    })

    //console.log(mydata)

    // the date of interest
    // later should be changed dynamically
    //var currentDate = parser("02-02-20")
    var currentDate = "04-10-20"

    let myd = mydata.filter(d => {
        return d.day == currentDate
    })

    // console.log(myd)

    // base layer
    var baselayer = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 18,
    }).addTo(mymap);

    // markers
    // {day: "02-03-20", cases: 0, deaths: 0, geoID: "AF", country: "Afghanistan", …}

    myd.forEach(d => {
        var marker = new L.circleMarker([+d.lat, +d.lng], {
            radius: radiusScale(+d.cases),
            fillColor: "red",
            color: "#ff7800",
            weight: 2,
            opacity: 1,
            fill: true
        })
        marker.bindTooltip(d.country + ": " +d.cases + " cases in " + d.day ).openTooltip();
        //marker.bindPopup(d.country + " in" + d.day + ": " + d.cases).openPopup();
        marker.addTo(mymap)
    })

}
