"use strict";
var simple = require("simple-mock");
var rx = require("rxjs");
require('expectations');

describe("controller", () => {
	let controller = require("./controller");
	
	function testSequence(sensorSequence, results){
		var target = rx.Observable.of(21);
		var sensor = rx.Observable.of.apply(null, sensorSequence).delay(1);
		return controller.relayPositions(sensor, target).toArray().toPromise()
			.then(result => expect(result).toEqual(results));
	}
	
	it("should switch on the relay when sensor temp is below targetTemp - 0.5", () => {
		return testSequence([21.5, 21, 20.5], [false, false, true]);
	});
	
	it("should switch off the relay when sensor temp goes above targetTemp", () => {
		return testSequence([20, 21, 21.5], [true, false, false]);
	});
	
	it("should not switch on relay until target - 0.5 is reached", () => {
		return testSequence([21.5, 21.0, 20.6], [false, false, false]);
	});
	
	it("should not switch off relay until target is reached", () => {
		return testSequence([19, 20, 20.9], [true, true, true]);
	});
});