// -----------------------------------------
// Main js file
// -----------------------------------------

var energyData = {};
var CO2Data = {};
var pie;
var color12 = [ 'rgb(141,211,199)',
                'rgb(255,255,179)',
                'rgb(190,186,218)',
                'rgb(251,128,114)',
                'rgb(128,177,211)',
                'rgb(253,180,98)',
                'rgb(179,222,105)',
                'rgb(252,205,229)',
                'rgb(217,217,217)',
                'rgb(188,128,189)',
                'rgb(204,235,197)',
                'rgb(255,237,111)'];

var dataLoaded = function() {
  console.log(energyData);
  console.log(CO2Data);
  pie = new pie();
}

loadData(energyData, CO2Data, dataLoaded);