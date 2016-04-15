"use strict";
let rx = require("rxjs/Rx");
module.exports = (scheduleObs, dateNow) => {
	let toMinutes = timeString => {
		let number = Number(timeString);
		return Math.floor(number / 100) * 60 + (number % 100);
	}

	let calculate = (schedule, now) => {	
		if (schedule.override && now < new Date(schedule.override[0]))
			return schedule.override[1];
			
		let day = now.getDay();
		let time = now.getHours() * 60 + now.getMinutes();
		let yesterday = schedule.days[(day + 6) % 7];
		let target = yesterday[yesterday.length - 1][1];
		schedule.days[day].forEach(p => target = toMinutes(p[0]) < time ? p[1] : target);
				
		return target;
	};

	return rx.Observable.combineLatest(
		scheduleObs, 
		rx.Observable.timer(0, 60000), 
		schedule => calculate(schedule, new Date(dateNow)));
};