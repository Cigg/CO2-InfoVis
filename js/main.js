var energyData = {};

//Load data
d3.csv("data/globalenergyuse-production.csv", function(error, data) {
	// Loop through data and put in correct category in energyData
	for (var i = 0; i < data.length; i++) {
		// If the current category dosen't exist yet, create new array
		if(!energyData[data[i]["Series Name"]])
			energyData[data[i]["Series Name"]] = new Array();

		// Push data to correct property array
		energyData[data[i]["Series Name"]].push(data[i]);
	};

	// That's beautiful!
	console.log(energyData);
});