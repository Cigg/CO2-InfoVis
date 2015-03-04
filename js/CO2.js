// -----------------------------------------
// Displays a graph of CO2 emission over time
// -----------------------------------------

function CO2() {

    // -----------------------------------------
    // Initial setup
    // -----------------------------------------

    // Grab the CO2 div with jquery
    var CO2Div = $("#co2");

    // width and height is based on container div size
    var margin = {top: 20, right: 20, bottom: 20, left: 35},
        width = CO2Div.width() - margin.right - margin.left,
        height = CO2Div.height() - margin.top - margin.bottom;

    // Setup scales and axes
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format("d"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.value); })
        .interpolate("monotone");


    // Setup svg components
    var svg = d3.select("#co2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
        .attr("class", "line");

    // Display axes
    svg.append("g")
        .attr("class", "x aAxis")
        .attr("transform", "translate(0," + height + ")");

    svg.append("g")
        .attr("class", "y aAxis")
        .attr("transform", "translate(0,0)");

    // Handle focus bar
    focus = svg.append("g")
        .attr("class", "focus");

    focus.append("line")
        .attr("class", "x")
        .attr("y1", 0)
        .attr("y2", y(0));

    // Title
    svg.append("g")
        .attr("class", "title")
        .append("text")
        .attr("x", 12)             
        .attr("y", 0)
        .attr("class", "title")
        .text("CO2 emissions over time");

    // -----------------------------------------
    // Handle data
    // -----------------------------------------

    this.selectCountry = function(country) {
        data = new Array();

        // Load years and values into data array for the correct country
        for(d in CO2Data["CO2POP"]){
            if(CO2Data["CO2POP"][d]["Region/Country/Economy"] == country){
                for(e in CO2Data["CO2POP"][d]) {
                    // Only push data values, not the country string
                    if(!isNaN(parseFloat(CO2Data["CO2POP"][d][e])))
                        data.push({ year: parseInt(e), value: parseFloat(CO2Data["CO2POP"][d][e]) })
                }
                break;
            }
        }

        // Used for handling displaying the vertical line
        // Must run after data is loaded, hence invoked here instead of during setup
        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mousemove", function() { 
                area.mousemove(d3.mouse(this)[0], d3.extent(data, function(d) { return d.year; })); 
                focus.select(".x").attr("transform", "translate(" + d3.mouse(this)[0] + ",0)"); 
            })
            .on("mouseout", function() { 
                area.mouseout(); 
                focus.select(".x").attr("style", "stroke:none;"); 
            })
            .on("mouseover", function() { 
                area.mouseover(); 
                focus.select(".x").attr("style", "stroke:orange;"); 
            });

        update(data);
    }

    // -----------------------------------------
    // Update graph with new data to make a smooth transition
    // -----------------------------------------

    function update(data) {
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.year; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        var t = svg.transition().duration(1000);
            t.select(".x.aAxis").call(xAxis);
            t.select(".y.aAxis").call(yAxis);
            t.select(".line").attr("d", valueline(data));
    }

    // -----------------------------------------
    // Called from the area view, updates vertical line
    // -----------------------------------------

    this.mouseover = function () {
        focus.select(".x").attr("style", "stroke:orange;");
    }

    // -----------------------------------------
    // Called from the area view, updates vertical line
    // -----------------------------------------

    this.mousemove = function (pos, domain) {
        var areaWidth = $("#area").width() - 20 - 35;
        var position = pos/areaWidth;
        var year = (domain[1] - domain[0]) * position + domain[0];
        var newPos;
        var CO2Domain = d3.extent(data, function(d) { return d.year; });
        

        if(year > CO2Domain[1])
            newPos = width;
        else if(year < CO2Domain[0])
            newPos = 0;
        else {
            var diff = (CO2Domain[1] - year)/(CO2Domain[1] - CO2Domain[0]);
            newPos = (1 - diff) * width;
        }   
        
        focus.select(".x").attr("transform", "translate(" + newPos + ",0)");
    }

    // -----------------------------------------
    // Called from the area view, updates vertical line
    // -----------------------------------------

    this.mouseout = function() {
        focus.select(".x").attr("style", "stroke:none;");
    }

    // Initial view 
    this.selectCountry("World");
}
