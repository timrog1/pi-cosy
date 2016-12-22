"use strict";
let rx = require("rxjs/Rx");
module.exports = (scheduleObs, timeObs) => {
	let addTime = (midnight, timeString) => {
		let number = Number(timeString);
		return new Date(midnight.getFullYear(), midnight.getMonth(), midnight.getDate(), Math.floor(number / 100), number % 100);
	}

	let calculate = (schedule, now) => {
		if (schedule.override) {
			let endTime = new Date(schedule.override[0]);
			if (endTime > now)
				return { current: schedule.override[1], next: [ endTime, calculate(schedule, endTime).current ] };
		}

		let dayOfWeek = now.getDay();
		let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		let yesterday = schedule.days[(dayOfWeek + 6) % 7];
		let target = yesterday[yesterday.length-1][1];
		for(let [time, temp] of schedule.days[dayOfWeek]) {
			let changeTime = addTime(midnight, time);
			if (changeTime > now)
				return { current: target, next: [ changeTime, temp ] };

			target = temp;
		}

		var tomorrow = schedule.days[(dayOfWeek + 1) % 7][0];
		midnight.setDate(midnight.getDate() + 1);
		return { current: target, next: [ addTime(midnight, tomorrow[0]), tomorrow[1] ] };
	};
		
	return rx.Observable.combineLatest(scheduleObs, timeObs, calculate).distinctUntilChanged();
};