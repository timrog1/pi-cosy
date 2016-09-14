"use strict";

let rx = require("rxjs");
let sensor = require("./sensor");
let wiring = require("./wiring");

let fs = require("fs");

var pad = x => (x < 10 ? "0" : "") + x;

function toEntry(entries)
{
	var date = new Date(),		
		hh = pad(date.getHours()),
		mm = pad(date.getMinutes()),		
		time = `${hh}${mm}`,
		data = entries.map(e => e.toFixed(1)).join(" ");

	return `${time} ${data}`;
}

function appendToFile(line)
{
	var date = new Date(),
		y = date.getYear() + 1900,
		m = pad(date.getMonth() + 1),
		d = pad(date.getDate()),
		filename = `logs/${y}${m}${d}.txt`;
		
	fs.appendFile(filename, line + "\r\n", "utf8", () => {})
}

var lines = rx.Observable.combineLatest(wiring.targetTemp, sensor, function(){ return Array.prototype.slice.call(arguments); })
	.throttleTime(60000)
	.map(toEntry);
	
lines.subscribe(appendToFile);

lines.subscribe(console.log);

