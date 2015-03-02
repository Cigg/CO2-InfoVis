// -----------------------------------------
// Displays an area graph of a country's total energy production 
// and production sources over time.
// Can alternate to showing a single production source
// -----------------------------------------

function area() {

    // -----------------------------------------
    // Initial setup
    // -----------------------------------------

    // Grab the area div with jquery
    var areaDiv = $("#area");

    // width and height is based on container div size
    var margin = {top: 20, right: 20, bottom: 20, left: 35},
        width = areaDiv.width() - margin.right - margin.left,
        height = areaDiv.height() - margin.top - margin.bottom;

    // Setup scales and axes
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format("d"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("s"));

    //initialize tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    // -----------------------------------------
    // Handle data
    // -----------------------------------------

    var country = "Sweden";
    var data = new Array();
    data[0] = getEnergyData("Electricity production from coal sources (kWh)", country);
    data[1] = getEnergyData("Electricity production from hydroelectric sources (kWh)", country);
    data[2] = getEnergyData("Electricity production from natural gas sources (kWh)", country);
    data[3] = getEnergyData("Electricity production from nuclear sources (kWh)", country);
    data[4] = getEnergyData("Electricity production from oil sources (kWh)", country);

    x.domain(findXDomain(data));
    y.domain(findYDomain(data));

    // Converts 2D data into stacked data, adding a y0 baseline
    var stack = d3.layout.stack().values(function(d) { return d.values; });
    stack(data);

    // -----------------------------------------
    // Render
    // -----------------------------------------

    var svg = d3.select("#area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var colors = d3.scale.category10();

    // Returns a displayable format of the data
    var area = d3.svg.area()
        .x(function(d) { return x(d.year); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y((d.y0 + d.y)); })
        .interpolate("monotone");

    var graph = svg.selectAll(".graph")
        .data(data)
        .enter().append("g")
        .attr("class", "graph")
        .style("fill", function(d, i) { return colors(i); })
        .append("path")
        .attr("class", "area")
        .attr("d", function(d) { return area(d.values); })
        .on('mouseover', function(d){
            var nodeSelection = d3.select(this)
                .transition()
                .duration(250)
                .style({opacity:'0.83'})

            tooltip.text(d.name);
            tooltip.style("visibility", "visible");
        })
        .on('mouseout', function(d){
            var nodeSelection = d3.select(this)
                .transition()
                .duration(250)
                .style({opacity:'1.0'});

             tooltip.style("visibility", "hidden");
        })
        .on("mousemove", function(){
            tooltip.style("top", (event.pageY-10)+"px")
                .style("left",(event.pageX+10)+"px");
        })

    svg.append("g")
        .attr("class", "aAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "aAxis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);
}
