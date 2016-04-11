"use strict";
let rest = require("./rest");

function weatherSensor(config) {
    let endpoint = `http://api.openweathermap.org/data/2.5/weather?q=${config.location}&APPID=${config.apiKey}`;

    let fetch = () => rest.get(endpoint).then(response => response.main.temp - 273.15);

    return {
        fetch: fetch,
        observe: provide => {
            let interval = setInterval(() => fetch().then(provide), 600000);
            fetch().then(provide);
            return () => clearInterval(interval);
        }
    }


}

module.exports = weatherSensor;