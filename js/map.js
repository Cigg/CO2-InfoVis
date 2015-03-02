// -----------------------------------------
// Displays a Chroropleth map of all countries
// -----------------------------------------
function map() {
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    // Grab the map div with jquery
    var mapDiv = $("#map");

    var quantize = d3.scale.quantize()
        .domain([0, d3.max(CO2Data.CO2POP, function(d) {
            if(!isNaN(d["2008"]))
                return d["2008"];
            else
                return 0;
        })])
        .range(sequentialColors);

    //console.log(JSON.stringify(CO2Data.CO2POP));

    // var data = []
    // for(country in CO2Data.CO2POP) {
    //     data.push({"country" : CO2Data.CO2POP[country]["Region/Country/Economy"], "2008" : niceNumber(CO2Data.CO2POP[country]["2008"])})
    // }

    // console.log(JSON.stringify(data));

    // width and height is based on container div size
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;
        scale = Math.min(width*0.16, height*0.3);

    // Create the svg area to draw in
    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    // The view in the map
    var projection = d3.geo.mercator()
        .center([0, 15])
        .scale(scale)
        .translate([width / 2, height / 2]);

    // Draws edges in the map
    var path = d3.geo.path().projection(projection);

    // Create graphics variable
    g = svg.append("g");

    //initialize tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    // load data and draw the map
    d3.json("data/world-topo.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });


    function draw(countries) {
        var country = g.selectAll(".country").data(countries);

        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("fill", function(d) {
                var countries = $.grep(CO2Data.CO2POP, function(c){ return c["Region/Country/Economy"] === d.properties.name; });
                if(countries.length == 1)
                {
                    //console.log(quantize(countries[0]["2008"]));
                    return quantize(countries[0]["2008"]);
                }

                return 'gray';
            })
            .on('mouseover', function(d){
                var nodeSelection = d3.select(this)
                    .transition()
                    .duration(250)
                    .style({opacity:'0.83'})

                tooltip.text(d.properties.name);
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
            // Selection
            .on("click", function(d) {
                selFeature(d.properties.name);
            });
    };

    //zoom and panning method
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    // Method for selecting features of other components
    function selFeature(value) {
        pie.selectCountry(value);
        CO2.selectCountry(value);
        area.selectCountry(value);
    }
}