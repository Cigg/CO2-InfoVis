// -----------------------------------------
// Displays a Chroropleth map of all countries
// -----------------------------------------

// Grab the map div with jquery
var mapDiv = $("#map");

// width and height is based on container div size
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
    height = mapDiv.height() - margin.top - margin.bottom;

// Create the svg area to draw in
var svg = d3.select("#map").append("svg")
	.attr("width", width)
	.attr("height", height);

// The view in the map
var projection = d3.geo.mercator()
    .center([90, 20 ])
    .scale(150);

// Draws edges in the map
var path = d3.geo.path().projection(projection);
// Create graphics variable
g = svg.append("g");

// load data and draw the map
d3.json("data/world-topo.json", function(error, world) {
    var countries = topojson.feature(world, world.objects.countries).features;
    draw(countries);
});

function draw(countries,data) {
    var country = g.selectAll(".country").data(countries);

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .style("fill", function(d) {
			return "#F52525"
        })
};