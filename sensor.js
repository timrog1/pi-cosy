"use strict";
var temp = require('ds18b20');

module.exports = provide => {
	temp.sensors((err, ids) => {
		let id = ids[0];
		let fetch = () => temp.temperature(id, (e, value) => provide(value));
		fetch();
		setInterval (fetch, 10000);	
	});
};