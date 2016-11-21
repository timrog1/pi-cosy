"use strict";
let rest = require("./rest");
let rx = require("rxjs");

function weatherSensor(config) {
    let endpoint = `http://api.openweathermap.org/data/2.5/weather?q=${config.location}&APPID=${config.apiKey}`;

    let responseToTemp = response => {
		var temp = (response.main && response.main.temp && response.main.temp - 273.15) || undefined;
		if (temp === undefined)
			console.error("Cannot read OpenWeatherMap response: " + JSON.stringify(response));

		return temp;
    }

    console.log("obs created");
    return rx.Observable.timer(0, 1800000)
    		.do(i => console.log("timer hit"))
		.flatMap(() => rest.get(endpoint).then(responseToTemp, () => undefined))
		.cache(20000);
}

module.exports = weatherSensor;
