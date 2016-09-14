"use strict";

let rx = require("rxjs");
let sensor = require("./sensor");
let targetTemp = require("./targetTemp");
let relay = require("./relay");
let controller = require("./controller");
let weather = require("./weatherSensor");
require("./observable-files");

let schedule = rx.Observable.fromFile("schedule.json").map(data => JSON.parse(data));
let time = rx.Observable.timer(0, 1000).map(() => new Date());
let target = targetTemp(schedule, time);

let config = {
    location: "GU85BY,UK",
    apiKey: "fec3e673e40c2bd7e653fde691adb046"
};

controller.relayPositions(sensor, target).subscribe(relay.set);

module.exports = rx.Observable.combineLatest(
	sensor,
	weather(config),
	target,
	schedule,
	controller.relayPositions(sensor, target),
	(s, w, t, sc, r) => ({
		inside: s,
		outside: w,
		target: t,
		schedule: sc,
		relay: r
	}));
