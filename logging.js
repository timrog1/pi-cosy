"use strict";

let rx = require("rxjs");
let fs = require("fs");

var pad = x => (x < 10 ? "0" : "") + x;

function toEntry(status)
{
	var date = new Date(),		
		hh = pad(date.getHours()),
		mm = pad(date.getMinutes()),		
		time = `${hh}${mm}`,
		entries = [ status.inside, status.outside, status.target.current ],
		data = entries.map(e => e ? e.toFixed(1) : "").join(" ");

	return `${time} ${data} ${~~status.relay}`;
}

function appendToFile(line)
{
	var date = new Date(),
		y = date.getYear() + 1900,
		m = pad(date.getMonth() + 1),
		d = pad(date.getDate()),
		filename = `logs/${y}${m}${d}.txt`;
	
	fs.appendFile(filename, line + "\r\n", "utf8", err => { if(err) console.warn(err); } )
}

let timer = rx.Observable.timer(0, 60000);

module.exports = status => 
	timer
	.withLatestFrom(status, (_, s) => toEntry(s))
	.subscribe(appendToFile, err => console.warn(err));

