"use strict";

let rx = require("rxjs");
let sensor = require("./sensor");
let targetTemp = require("./targetTemp");
let relay = require("./relay");
let controller = require("./controller");

let fs = require("fs");

rx.Observable.fromFile = (filename, options) => 
{
		let read = () => rx.Observable.create(obs => 
			fs.readFile(filename, options || "utf8", (err, data) => obs.next(data)));
			
		let watchObs = rx.Observable.create(obs => fs.watch(filename, () => obs.next(1)))
			.throttleTime(100).delay(100)
			.flatMap(read);
		
		return read().merge(watchObs);
}		

let schedule = rx.Observable.fromFile("schedule.json").map(data => JSON.parse(data));

let time = rx.Observable.timer(0, 1000).map(_ => new Date());

let target = targetTemp(schedule, time);

sensor.subscribe(v =>"Sensor " +console.log(v));

module.exports = () => 
	controller.relayPositions(sensor, target);
