"use strict";

try {
	var gpio = require("pi-gpio");
	var pin = 12;

	var openp = new Promise (resolve => gpio.open(pin, "output", resolve));
	module.exports = {
		set: value => openp.then(gpio.write(pin, value))
	};
}
catch(e)
{
	console.log(`No GPIO. Relay is in fake mode.`);
	module.exports = { 
		set: value => console.log("Relay set to " + value)
	};
}
