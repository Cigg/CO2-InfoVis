// ------------------------------------------------------
// Displays a pie chart of energy consumption per sector
// ------------------------------------------------------
function pie() {
	console.log("pie");
	//console.log("sector data: " + JSON.stringify(CO2Data.SECTOR));
  //console.log("sector data, world: " + JSON.stringify(CO2Data.SECTOR[0]));
    
  var pieDiv = $("#pie");

  var margin = {top: 40, right: 120, bottom: 20, left: 120},
      width = pieDiv.width() - margin.right - margin.left,
      height = pieDiv.height() - margin.top - margin.bottom,
  	radius = Math.min(width, height) / 2;


  console.log("height: " + height);
  console.log("width: " + width);

  var color = d3.scale.ordinal()
      .range(qualitativeColors);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0); // increase inner radius to create donut shape

  // Outer arc for text labels
  var outerArc = d3.svg.arc()
    .innerRadius(radius * 1.05)
    .outerRadius(radius * 1.05);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.value; });

  var svg = d3.select("#pie").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

  svg.append("g")
    .attr("class", "slices");
  svg.append("g")
    .attr("class", "labels");
  svg.append("g")
    .attr("class", "lines");
  svg.append("g")
    .attr("class", "title");

  // Title
  var title = svg.select(".title")
      .append("text")
      .attr("x", 0)             
      .attr("y", - height / 2 - 14)
      .attr("text-anchor", "middle")  
      .attr("class", "title")
      .text("");

  this.selectCountry = function(country) {
    var countries = $.grep(CO2Data.SECTOR, function(c){ return c["Region/Country/Economy"] === country; });

    if (countries.length == 0) {
      console.error("ERROR: pie.js: Country '" + country + "' not found.");
      return;
    } else if (countries.length == 1) {
      var countryData = countries[0];
    } else {
      console.error("ERROR: pie.js: Multiple countries '" + country + "' found.");
      return;
    }

    var data = [  {"sector": "Electr. and heat", "value": niceNumber(countryData["Electricity and heat production"]), "percentage" : 10},
                  {"sector": "Industries", "value": niceNumber(countryData["Manuf. industries \nand construction"]) + niceNumber(countryData["Other energy \nindustries**"]), "percentage" : 10},
                  {"sector" : "Transport", "value" : niceNumber(countryData["Transport"]), "percentage" : 10},
                  {"sector" : "Residential", "value" : niceNumber(countryData["of which: residential"]), "percentage" : 10},
                  {"sector" : "Other", "value" : niceNumber(countryData["Other sectors"]) - niceNumber(countryData["of which: residential"]), "percentage" : 10}];

    drawText(country);
    draw(country, data);
  }

  function drawText(country) {
    title
      .transition().duration(1000/2)
      .style("opacity", 0)
      .transition().duration(1000/2)
      .style("opacity", 1)
      .text(country);
  }

  function draw(country, data) { 
    // Pie slices
    var g = svg.select(".slices").selectAll("slice")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "slice");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.sector); });
      //.attr("class", "slice");

    g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.percentage + "%"; });

    g.transition().duration(1000)
      .attrTween("d", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        }
      })

    //slice.remove();

    // Text labels
    var text = svg.select(".labels")
      .selectAll("text")
      .data(pie(data));

    text.enter().append("text").
      attr("dy", ".35em").
      text(function(d) {
        return d.data.sector;
      });

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
      .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 1.05 * (midAngle(d2) < Math.PI ? 1 : -1);
          return "translate(" + pos + ")";
        };
      })
      .styleTween("text-anchor", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start":"end";
        };
      });

    text.exit().remove();

    // Lines to labels
    var polyline = svg.select(".lines").selectAll("polyline")
      .data(pie(data));

    polyline.enter()
      .append("polyline");

    polyline.transition().duration(1000)
      .attrTween("points", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });

    polyline.exit().remove();
  }

  this.selectCountry("World");
}