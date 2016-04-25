"use strict";
var temp = require('ds18b20');
let rx = require("rxjs");

function init(provide){
	temp.sensors((err, ids) => {
		let id = ids[0];
		let fetch = () => new Promise(resolve => temp.temperature(id, (e, value) => resolve(value));
		return rx.Observable.timer(0, 1000).flatMap(fetch);
	});
}

module.exports = rx.Observable.bindCallback(init)().mergeAll();