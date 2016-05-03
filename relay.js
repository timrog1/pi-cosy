"use strict";

if(/^win/.test(process.platform))
{
	module.exports = { 
		set: value => console.log("Relay set to " + value)
	};
}
else
{
	var gpio = require("rpi-gpio");
	var pin = 12;
	var value = false;

	module.exports = {
		set: value =>
			gpio.setup(pin, gpio.DIR_OUT, () =>  
				gpio.write(pin, value, () => {}))
	};
}
