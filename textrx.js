"use strict";

let rx = require("rxjs");
let rest = require("./rest");
let wiring = require("./wiring");

/*var t = 290;
rest = {
	get: url => {
		console.log("Mock fetching " + url);
		return new Promise (resolve => setTimeout (() => resolve({ main: { temp: t++ }  }), 2000));
	}	
};
*/

let endpoint = `http://api.openweathermap.org/data/2.5/weather?q=GU85BY,UK&APPID=fec3e673e40c2bd7e653fde691adb046`;
 let responseToTemp = response => {
		var temp = (response.main && response.main.temp && response.main.temp - 273.15) || undefined;
		if (temp === undefined)
			console.error("Cannot read OpenWeatherMap response: " + response);

		return temp;
    };
	
let timer = rx.Observable.timer(0, 1800000)
	.flatMap(() => rest.get(endpoint).then(responseToTemp, () => undefined))
	.cache(1);
	
//timer.subscribe(i => console.log("A: " + i));

//setTimeout(() => timer.subscribe(i => console.log("B: " + i)), 5500);

rx.Observable.timer(0, 1000).subscribe(() => wiring.first().map(x => x.outside).subscribe(x => console.log("C:" + x)));