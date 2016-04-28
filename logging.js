"use strict";

let rx = require("rxjs");
let sensor = require("./sensor");
let wiring = require("./wiring");

let fs = require("fs");

function toLogFile(entries)
{
	var pad = x => (x < 10 ? "0" : "") + x;
	var date = new Date(),
		y = date.getYear() + 1900,
		m = pad(date.getMonth() + 1),
		d = pad(date.getDate()),
		hh = pad(date.getHours()),
		mm = pad(date.getMinutes()),
		filename = `logs/${y}${m}${d}.txt`,
		time = `${hh}${mm}`,
		data = entries.join(" "),
		line = `${time} ${data}`;

	console.log(line);
	fs.appendFile(filename, line + "\r\n", "utf8", () => {});
}

rx.Observable.combineLatest(wiring.targetTemp, sensor, wiring.weatherSensor, (a, b, c) => [a, b, c])
	.throttleTime(60000)
	.subscribe(toLogFile);
