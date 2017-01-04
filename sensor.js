"use strict";
var temp = require('ds18b20');
let rx = require("rxjs");

module.exports = rx.Observable.create(obs => {
	let fetch = () => 
		temp.sensors((err, ids) => 
			err || !ids || !ids[0] 
				? obs.next(undefined) 
				: temp.temperature(ids[0], (e, value) => obs.next(value)));

	rx.Observable.timer(0, 1000).subscribe(fetch);
}).distinctUntilChanged();