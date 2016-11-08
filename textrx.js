"use strict";

let rx = require("rxjs");

let producer = rx.Observable.timer(0, 10000)
	.do(i => console.log("Timer hit: " + i))
        .map(() => console.log("producing an expensive value...") || 12 + Math.random() * 5);
let requestSubject = new rx.Subject();

var i = 0;
setInterval (
	_ => requestSubject.next(i++),
	2500);
requestSubject.withLatestFrom(producer, (i, v) => 
	"Value given to response " + i + " is " + v)
	.subscribe(v => console.log(v));

