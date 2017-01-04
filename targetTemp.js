"use strict";
let rx = require("rxjs/Rx");
module.exports = (scheduleObs, timeObs) => {
	let addTime = (midnight, timeString) => {
		let number = Number(timeString);
		return new Date(midnight.getFullYear(), midnight.getMonth(), midnight.getDate(), Math.floor(number / 100), number % 100);
	}

	let relativeDayToAbsolute = (day, midnight) => 
		day.map (([minString, temp]) => [ addTime(midnight, minString), temp ]);

	let calculate = (schedule, now) => {
		let changes = (schedule.override || []).map(([d, t]) => [ new Date(d), t, true ]);
		let earliest = changes[0] && changes[0][0], latest = changes[0] && changes[changes.length-1][0];
		let filter = ([d, t]) => !(d > earliest && d < latest);
		for (var i = -1; i <= 1; i++) {
			let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
			let day = schedule.days[midnight.getDay()];
			let dayChanges = relativeDayToAbsolute(day, midnight).filter(filter);
			changes = changes.concat(dayChanges);
		}
		
		changes.sort(([a, _], [b, __]) => a-b);
		var previous = changes[0];
		for (let change of changes) {
			if(change[1] != previous[1])
			{
			if (change[0] > now) 
				return { current: previous[1], next: [ change[0], change[1] ], override: !!previous[2] || latest > now };
			previous = change;
			}
		}
	};
		
	return rx.Observable.combineLatest(scheduleObs, timeObs, calculate).distinctUntilChanged();
};