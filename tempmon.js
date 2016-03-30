"use strict";
var temp = require('ds18b20');

temp.sensors((err, ids) => {
	let id = ids[0];
	let logTemp = () => temp.temperature(id, (e, value) => console.log(value));
	logTemp();
	setInterval (logTemp, 5000);	
});

