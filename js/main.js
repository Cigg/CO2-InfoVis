// -----------------------------------------
// Main js file
// -----------------------------------------

var energyData = {};
var CO2Data = {};
var pie;

// colors from colorbrewer2.org
var qualitativeColors = ['rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)','rgb(217,217,217)','rgb(188,128,189)','rgb(204,235,197)','rgb(255,237,111)'];
var sequentialColors = ['rgb(255,255,204)','rgb(255,237,160)','rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(189,0,38)','rgb(128,0,38)'];

var dataLoaded = function() {
  console.log(energyData);
  console.log(CO2Data);
  pie = new pie();
  map = new map();
  area = new area();
}

loadData(energyData, CO2Data, dataLoaded);