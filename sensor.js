"use strict";
var temp = require('ds18b20');
let rx = require("rxjs");

module.exports = rx.Observable.create(obs => 
	temp.sensors((err, ids) => {
		if (err || !ids || !ids[0]) obs.next(20);
		else {
			let id = ids[0];
			let fetch = () => temp.temperature(id, (e, value) => obs.next(value));
			rx.Observable.timer(0, 1000).subscribe(fetch);
		}
	}));