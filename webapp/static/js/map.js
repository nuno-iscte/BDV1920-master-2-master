'use strict';

'use strict';
// with strict mode, you can not, for example, use undeclared variables

//****************************************************
// 		the map
//****************************************************

// Note: visualization will be put in the div with id=map_id 

// my own token to access mapbox tiles
var mymapboxtoken = 'pk.eyJ1IjoiYW1sc3MxIiwiYSI6ImNqZzZxMjdvbjd3bDQyd3FvaWc1cnZjNHgifQ.vQiQw-UlfnCNfguzGdGT2A';

// the map
var mapcentre = [38.72, -9.15], zoom = 13, max_zoom = 20;
var mymap = L.map('map_id').setView(mapcentre, zoom);

// the base layer
var baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: max_zoom,
  id: 'mapbox.streets',
  accessToken: mymapboxtoken
}).addTo(mymap);

// the popup
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked at " + e.latlng.toString())
        .openOn(mymap);
 }
console.log(data)
mymap.on('click', onMapClick);

// the markers

// room_categories = ['Entire home/apt', 'Private room', 'other'];

var mapMarkers = [];

function deleteMapMarkers() {
	for (var d in mapMarkers) {
		d.setMap(null);
	}
	mapMarkers = [];
}

function drawMapMarkers(data) {
	deleteMapMarkers();
	var msg = "";
	var marker;
	data.forEach(function(d) {
		d.latitude = +d.latitude;
		d.longitude = +d.longitude;
		msg = d.room_type + "; " + d.price + "€";
		marker = L.marker([d.latitude, d.longitude]).bindPopup(msg).addTo(mymap);
		mapMarkers.push(marker);
	});
}

