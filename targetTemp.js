"use strict";
module.exports = schedule => {
	let toMinutes = timeString => {
		let number = Number(timeString);
		return Math.floor(number / 100) * 60 + (number % 100);
	}

	return dateNow => {
		let now = new Date(dateNow);
		let day = now.getDay();
		let time = now.getHours() * 60 + now.getMinutes();
		let yesterday = schedule.days[(day + 6) % 7];
		let target = yesterday[yesterday.length - 1][1];
		schedule.days[day].forEach(p => target = toMinutes(p[0]) < time ? p[1] : target);
		return target;
	}
};