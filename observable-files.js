"use strict";

let rx = require("rxjs");
let fs = require("fs");

rx.Observable.fromFile = (filename, options) => 
{
	let read = () => rx.Observable.create(obs => 
		console.log("Reading " + filename + "...") ||
		fs.readFile(filename, options || "utf8", (err, data) => console.log(err? "Read error: " + err : "Read") || obs.next(data)));
		
	let watchObs = rx.Observable.create(obs => fs.watch(filename, () => obs.next(1)))
		.throttleTime(100).delay(100)
		.flatMap(read);
	
	return read().merge(watchObs);
}		