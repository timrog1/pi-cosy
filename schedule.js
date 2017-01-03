"use strict";

var fs = require("fs");
var rx = require("rxjs");

require("./observable-files")

module.exports = (filename, scheduler) => {
	let scheduleFileObs = rx.Observable.fromFile(filename).map(data => JSON.parse(data)).cache(1);
	
	let updates = new rx.Subject();
	let schedules = scheduleFileObs.merge(updates);

	let overrideSubject = new rx.Subject();	
	let updated = overrideSubject.withLatestFrom(schedules, (o, s) => { 
		s.override = o;
		return s;
	});

	schedules = schedules.merge(updated);

	//	updates.throttleTime(5000, scheduler)
	//		.subscribe(s => fs.writeFile(filename, JSON.stringify(s), (e) => console.log(e? "Write error " + e : "Written")));

	schedules.override = changes => overrideSubject.next(changes);
	schedules.clearOverride = () => overrideSubject.next([]);
	schedules.update = newSchedule => updates.next(newSchedule);

	return schedules;
};