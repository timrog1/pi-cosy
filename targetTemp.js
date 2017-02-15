"use strict";
let rx = require("rxjs/Rx");
let override = require("./override");
module.exports = (scheduleObs, timeObs) => {
	let addTime = (midnight, timeString) => {
		let number = Number(timeString);
		return new Date(midnight.getFullYear(), midnight.getMonth(), midnight.getDate(), Math.floor(number / 100), number % 100);
	}

	let relativeDayToAbsolute = (day, midnight) => 
		day.map (([minString, temp]) => [ addTime(midnight, minString), temp ]);

	let calculate = (schedule, now) => {
		let changes = [];
		for (var i = -1; i <= 1; i++) {
			let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
			let day = schedule.days[midnight.getDay()];
			let dayChanges = relativeDayToAbsolute(day, midnight);
			changes = [ ...changes, ...dayChanges ];
		}

		while (changes.length >= 2)
		{
			let [[d1,t1],  [d2,t2], ...rest] = changes;
			if (d2 > now) break;
			changes = [[d2, t2], ...rest];
		}

		const isOverride = schedule.override && new Date(schedule.override.until) > now;
		if (isOverride)
			changes = override.apply(changes, schedule.override);

		let currentUntil = override.extract(changes);
		return { 
			current: currentUntil.now, 
			until: currentUntil.until, 
			nowAndNext: changes, 
			override: isOverride 
		};
	};
		
	return rx.Observable.combineLatest(scheduleObs, timeObs, calculate).distinctUntilChanged();
};