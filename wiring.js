"use strict";

let rx = require("rxjs");
let sensor = require("./sensor");
let targetTemp = require("./targetTemp");
let relay = require("./relay");
let controller = require("./controller");
let weather = require("./weatherSensor");
let schedule = require("./schedule")("schedule.json");

let time = rx.Observable.timer(0, 1000).map(() => new Date());

let target = targetTemp(schedule, time);

let config = {
    location: "GU8+5BY,UK",
    apiKey: "fec3e673e40c2bd7e653fde691adb046"
};

let weatherObs = weather(config);

let relayPositions = controller.relayPositions(sensor, target.map(t => t.current)).cache(1);

relayPositions.subscribe(relay.set);

let statusCombined = rx.Observable.combineLatest(
	sensor,
	weatherObs,
	target,
	schedule,
	relayPositions,
	(s, w, t, sc, r) => ({
		inside: s,
		outside: w,
		target: t,
		schedule: sc,
		relay: r
	}));

module.exports = {
	schedule: schedule,
	values: statusCombined
};

require("./logging")(statusCombined);