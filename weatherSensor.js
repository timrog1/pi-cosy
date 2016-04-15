"use strict";
let rest = require("./rest");
let rx = require("rxjs");

function weatherSensor(config) {
    let endpoint = `http://api.openweathermap.org/data/2.5/weather?q=${config.location}&APPID=${config.apiKey}`;

    let fetch = () => rest.get(endpoint).then(response => response.main.temp - 273.15);

	return rx.Observable.timer(0, 600000).flatMap(fetch);
}

module.exports = weatherSensor;