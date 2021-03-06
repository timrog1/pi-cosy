"use strict";
var assert = require("assert");
var simple = require("simple-mock");
var rx = require("rxjs");
require('expectations');

describe("targetTemp", () => {
	let sut = require("./targetTemp");

	var schedule;
	beforeEach(() => schedule = { days: Array(7).fill([ [ "0800", 20 ], [ "1200", 16 ] ]) });

	let getTarget = (now) =>
		sut(rx.Observable.of(schedule), rx.Observable.of(now)).first().toPromise();

	let expectTempToBe = (expected, now) => 
		getTarget(now).then(t => expect(t.current).toBe(expected));
	
	it("should provide the target for the current time of day", () => {
		let now = new Date (2016, 3, 3, 10, 20); // Sunday
		return expectTempToBe(20, now);
	});
	
	it("should provide the target before the first entry of the day", () => {
		let now = new Date (2016, 3, 5, 7, 20); 
		return expectTempToBe(16, now);
	});
	
	it("should wrap around the week", () => {
		let now = new Date (2016, 3, 3, 7, 20); 
		return expectTempToBe(16, now);
	});
	
	it("should allow an override temp", () => {
		schedule.override = [new Date(2016, 3, 3, 7, 25), 25];
		let now = new Date (2016, 3, 3, 7, 20);
		return expectTempToBe(25, now);
	});
	
	it("should cancel the override at the specified end time", () => {
		schedule.override = [new Date(2016, 3, 3, 7, 25), 25];
		let now = new Date (2016, 3, 3, 7, 25);
		return expectTempToBe(16, now);
	});
	
	it("should update when the schedule updates", () => {
		let now = new Date (2016, 3, 3, 10, 20); 		
		let updatedSchedule = { days: Array(7).fill([ [ "0800", 20 ], [ "1000", 15 ] ]) };
		let sequence = rx.Observable.of(schedule, updatedSchedule);
			
		return sut(sequence, rx.Observable.of(now))
			.first().toPromise()
			.then(a => expect(a.current).toBe(15));
	});

	it("should give the next time and temperature change", () => {
		let now = new Date (2016, 3, 3, 10, 20); // Sunday
		return getTarget(now).then(t => expect(t.next).toEqual([new Date(2016, 3, 3, 12, 0), 16]));
	});

	it("should give the next time and temperature change after an override", () => {
		schedule.override = [new Date(2016, 3, 3, 9, 25), 25];
		let now = new Date (2016, 3, 3, 8, 20); // Sunday
		return getTarget(now).then(t => expect(t.next).toEqual([new Date(2016, 3, 3, 9, 25), 20]));
	});

	it("the next time should wrap around to the following day", () => {
		let now = new Date (2016, 3, 3, 18, 11);
		return getTarget(now).then(t => expect(t.next).toEqual([new Date(2016, 3, 4, 8, 0), 20]));
	});
});