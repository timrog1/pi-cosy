"use strict";
let rx = require("rxjs/Rx");

function map(sensor, target){
	return sensor < target ? sensor <= (target - 0.5) ? true : undefined : false;
}

module.exports = {
	relayPositions: (sensorObs, targetObs) => {
		return rx.Observable.combineLatest(sensorObs, targetObs, map)
			.scan((previous, current) => current === undefined ? previous : current, false);
	}
};