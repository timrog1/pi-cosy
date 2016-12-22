"use strict";

if(/^win/.test(process.platform))
{
	module.exports = { 
		set: value => console.log("Relay set to " + value)
	};
}
else
{
	var gpio = require("pi-gpio");
	var pin = 12;

	var openp = new Promise (resolve => gpio.open(pin, "output", resolve));
	module.exports = {
		set: value => openp.then(gpio.write(pin, value))
	};
}
