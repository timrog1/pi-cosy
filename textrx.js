"use strict";

let rx = require("rxjs");

rx.Observable.combineLatest (
	rx.Observable.timer(0, 900),
	rx.Observable.timer(0, 1100),
	(a, b) => a + b)

	.map(t => {if(t == 10) throw "This should trigger a meltdown"; else return t; })
	.subscribe(t => console.log(t));