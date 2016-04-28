"use strict";
var gpio = require("rpi-gpio");
var pin = 12;
var value = false;

module.exports = {
	set: value =>
		gpio.setup(pin, gpio.DIR_OUT, () =>  
			gpio.write(pin, value, () => {}))
};
