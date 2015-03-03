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

    this.selectCountry = function(country) {
        console.log(country);
        var data = new Array();
        data[0] = getEnergyData("Electricity production from coal sources (kWh)", country);
        data[1] = getEnergyData("Electricity production from hydroelectric sources (kWh)", country);
        data[2] = getEnergyData("Electricity production from natural gas sources (kWh)", country);
        data[3] = getEnergyData("Electricity production from nuclear sources (kWh)", country);
        data[4] = getEnergyData("Electricity production from oil sources (kWh)", country);

        // Converts 2D data into stacked data, adding a y0 baseline
        var stack = d3.layout.stack().values(function(d) { return d.values; });
        stack(data);

        draw(data);
    }

    // -----------------------------------------
    // Render
    // -----------------------------------------

    function draw(data) {
        x.domain(findXDomain(data));
        y.domain(findYDomain(data));

        d3.select("#area svg").remove();
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
            .on("click", function(d){
                drawOne(data, d.name);
            }); 

        svg.append("g")
            .attr("class", "aAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "aAxis")
            .attr("transform", "translate(0,0)")
            .call(yAxis);
    }

    // Only draw one of the energy sources
    function drawOne(data, dataType){
        var i = 0;
        for(i = 0; i < data.length; i++){
            if(dataType == data[i].name){
                break;
            }
        }

        // Define the line
        var valueline = d3.svg.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.y); })
            .interpolate("monotone");

        // Scale the range of the data
        x.domain(d3.extent(data[i].values, function(d) { return d.year; }));
        y.domain([0, d3.max(data[i].values, function(d) { return d.y; })]);

        // Create the svg area to draw in
        d3.select("#area svg").remove();
        var svg = d3.select("#area").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data[i].values))
            .on("click", function(d){
                draw(data);
            }); 

        svg.append("g")
            .attr("class", "aAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "aAxis")
            .attr("transform", "translate(0,0)")
            .call(yAxis);

        // Handle vertical view
        var focus = svg.append("g")
            .attr("class", "focus");

        focus.append("line")
            .attr("class", "x")
            .attr("y1", 0)
            .attr("y2", y(0));

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mousemove", function() { CO2.mousemove(d3.mouse(this)[0], d3.extent(data[i].values, function(d) { return d.year; })); focus.select(".x").attr("transform", "translate(" + d3.mouse(this)[0] + ",0)"); })
            .on("mouseout", function() { CO2.mouseout(); focus.select(".x").attr("style", "stroke:none;"); })
            .on("mouseover", function() { CO2.mouseover(); focus.select(".x").attr("style", "stroke:orange;"); });
    }

    this.selectCountry("World");
}
