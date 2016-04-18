"use strict";

let rx = require("rxjs");

var subs;
rx.Observable.combineLatest(
	rx.Observable.create(
		a => {
			a.next(1);
			subs = a;
		}
	).map(i => "A=" + i), 
	rx.Observable.of(4,5,6).map(i => " B=" + i), 
	(a, b) => a + b)
	.subscribe(x => {
		console.log(x);
		if(subs){
		subs.next(2);
		subs.complete();
		subs = undefined;}
	}	);