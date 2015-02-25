// -----------------------------------------
// Main js file
// -----------------------------------------

var energyData = {};
var CO2Data = {};
var pie;

var dataLoaded = function() {
  console.log(energyData);
  console.log(CO2Data);
  pie = new pie();
}

loadData(energyData, CO2Data, dataLoaded);