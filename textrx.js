"use strict";

let rx = require("rxjs");
let rest = require("./rest");
let sensor = require("./sensor");
require("./observable-files");

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
	
let weather = rx.Observable.timer(0, 1800000)
	.flatMap(() => rest.get(endpoint).then(responseToTemp, () => undefined))
	.cache(1);

let timer = rx.Observable.timer(0, 5000);

let file = rx.Observable.fromFile("config.json");

rx.Observable.combineLatest(weather, timer, sensor, (w, t, s) => "A" + w + "/" + s)
	.subscribe(x => console.log(x));