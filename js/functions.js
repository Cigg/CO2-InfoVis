// -----------------------------------------
// Provides necessary functions for the application.
// Declutters the main js file
// -----------------------------------------

// -----------------------------------------
// Load all data and store it in the parameter variables
// -----------------------------------------
function loadData(energyData, CO2Data, callback) {

	var thingsToLoad = 9;

	var thingLoaded = function() {
		thingsToLoad--;
		if(thingsToLoad < 1)
			callback();
	}

	d3.csv("data/globalenergyuse-production.csv", function(error, data) {
		// Loop through data and put in correct category in energyData
		for (var i = 0; i < data.length; i++) {
			// If the current category dosen't exist yet, create new array
			if(!energyData[data[i]["Series Name"]])
				energyData[data[i]["Series Name"]] = new Array();

			// Push data to correct property array
			energyData[data[i]["Series Name"]].push(data[i]);
		};

		thingLoaded();
	});

	d3.csv("data/co2highlights _CO2-POP.csv", function(error, data){
		CO2Data.CO2POP = data;
		thingLoaded();
	});

	d3.csv("data/co2highlights _POP.csv", function(error, data){
		CO2Data.POP = data;
		thingLoaded();
	});

	d3.csv("data/co2highlights _SECTOR.csv", function(error, data){
		CO2Data.SECTOR = data;
		thingLoaded();
	});

	d3.csv("data/co2highlights _SECTPOP.csv", function(error, data){
		CO2Data.SECTPOP = data;
		thingLoaded();
	});

	d3.csv("data/co2highlights_CO2-SA.csv", function(error, data){
		CO2Data.CO2SA = data;
		thingLoaded();
	});

	d3.csv("data/co2highlights_CO2-SA_Coal.csv", function(error, data){
		CO2Data.CO2SACOAL = data;
		thingLoaded();
	});

	d3.csv("data/co2highlights_CO2-SA_Gas.csv", function(error, data){
		CO2Data.CO2SAGAS = data;
		thingLoaded();
	});

	d3.csv("data/co2highlights_CO2-SA_Oil.csv", function(error, data){
		CO2Data.CO2SAOIL = data;
		thingLoaded();
	});
}

// -----------------------------------------
// Remove unnecessary stuff from a number (string)
// -----------------------------------------
function niceNumber(number) {
	return parseFloat(number.replace(/ /g, ''));
}

// -----------------------------------------
// Finds the X domain in an array
// This is based on the energyData array from main
// Used like this: x.domain(findXDomain(data));
// Array structure:
//
// array[]
//		object{}
//			name
//			values[]
//
// -----------------------------------------
function findXDomain(arr) {
    var lastYear = arr[0].values.length;
    return [arr[0].values[0].year, arr[0].values[lastYear-1].year];
}

// -----------------------------------------
// Finds the Y domain in an array
// This is based on the energyData array from main
// Used like this: y.domain(findYDomain(data));
// Array structure:
//
// array[]
//		object{}
//			name
//			values[]
//
// -----------------------------------------
function findYDomain(arr) {
    var minTotal = 0;
    var maxTotal = 0;

    for(var j = 0; j < arr.length; j++){
        var min = 0;
        var max = 0;

        for(var i = 0; i < arr[j].values.length; i++) {
            var temp = arr[j].values[i].y;
            if(temp > max)
                max = temp;
            if(temp < min)
                min = temp;
        }

        minTotal += min;
        maxTotal += max;
    }

    return [minTotal,maxTotal];
}

// -----------------------------------------
// Returns an object containing data type name and formatted values
// Used like this: data[0] = getEnergyData("Electricity production from coal sources (kWh)", country);
// Returned object's structure:
//
// object {}
// 		name
//		values[]
//
// -----------------------------------------
function getEnergyData(dataKind, country) {
    var countryCode;

    for(var d in energyData[dataKind]){
        var tempName = energyData[dataKind][d]["Country Name"];
        if( country == tempName) {
            countryCode = d;
            break;
        }
    }

    var countryData = energyData[dataKind][countryCode];
    var data = new Object();
    data.values = new Array();
    data.name = dataKind;

    for(var d in countryData){
        if(!isNaN(d)){
            if(isNaN(parseInt(countryData[d])))
                data.values.push({year:parseInt(d), y:0});
            else
                data.values.push({year:parseInt(d), y:parseInt(countryData[d])});
        }
    }

    return data;
}