"use strict";
var temp = require('ds18b20');
let rx = require("rxjs");

module.exports = provide => {
	temp.sensors((err, ids) => {
		let id = ids[0];
		let fetch = () => temp.temperature(id, (e, value) => provide(value));
		return rx.Observable.timer(0, 1000).flatMap(fetch);
	});
};