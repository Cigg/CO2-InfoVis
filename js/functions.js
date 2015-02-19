// -----------------------------------------
// Provides necessary functions for the application.
// Declutters the main js file
// -----------------------------------------

//Load all data and store it in the parameter variables
function loadData(energyData, CO2Data) {
	d3.csv("data/globalenergyuse-production.csv", function(error, data) {
		// Loop through data and put in correct category in energyData
		for (var i = 0; i < data.length; i++) {
			// If the current category dosen't exist yet, create new array
			if(!energyData[data[i]["Series Name"]])
				energyData[data[i]["Series Name"]] = new Array();

			// Push data to correct property array
			energyData[data[i]["Series Name"]].push(data[i]);
		};
	});

	d3.csv("data/co2highlights _CO2-POP.csv", function(error, data){
		CO2Data.CO2POP = data;
	});

	d3.csv("data/co2highlights _POP.csv", function(error, data){
		CO2Data.POP = data;
	});

	d3.csv("data/co2highlights _SECTOR.csv", function(error, data){
		CO2Data.SECTOR = data;
	});

	d3.csv("data/co2highlights _SECTPOP.csv", function(error, data){
		CO2Data.SECTPOP = data;
	});

	d3.csv("data/co2highlights_CO2-SA.csv", function(error, data){
		CO2Data.CO2SA = data;
	});

	d3.csv("data/co2highlights_CO2-SA_Coal.csv", function(error, data){
		CO2Data.CO2SACOAL = data;
	});

	d3.csv("data/co2highlights_CO2-SA_Gas.csv", function(error, data){
		CO2Data.CO2SAGAS = data;
	});

	d3.csv("data/co2highlights_CO2-SA_Oil.csv", function(error, data){
		CO2Data.CO2SAOIL = data;
	});
}