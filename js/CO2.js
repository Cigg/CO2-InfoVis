// -----------------------------------------
// Displays a graph of CO2 emission over time
// -----------------------------------------

// Grab the CO2 div with jquery
var CO2Div = $("#co2");

// width and height is based on container div size
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = CO2Div.width() - margin.right - margin.left,
    height = CO2Div.height() - margin.top - margin.bottom;

// Create the svg area to draw in
var svg = d3.select("#co2").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g");

// Setup scales and axes
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

draw();

function draw()
{
    // Add x axis and title.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .text("X axis")
        .attr("class", "label")
        .attr("x", width/2)
        .attr("y", 30);
        
    // Add y axis and title.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .text("Y axis")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -35)
        .attr("x", -height/2)
        .attr("dy", ".71em");
}