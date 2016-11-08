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
	var value = false;

	module.exports = {
		set: value =>
			gpio.open(pin, "output", () => gpio.write(pin, value, () => gpio.close(pin)))
	};
}
