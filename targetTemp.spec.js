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
	
	describe("override", () => { 
		it("should allow an override range", () => {
			schedule.override = [ [ new Date(2016, 3, 3, 7, 25), 25 ] ];
			let now = new Date (2016, 3, 3, 7, 30);
			return expectTempToBe(25, now);
		});
		
		it("should ignore changes for duration of an override range", () => {
			schedule.override = [ [ new Date(2016, 3, 3, 7, 25), 25 ], [ new Date(2016, 3, 3, 19, 30), 22 ] ];
			let now = new Date (2016, 3, 3, 12, 30);
			return expectTempToBe(25, now);
		});
		
		it("should revert to the second temperature after the first override end time until the next time in the schedule", () => {
			schedule.override = [ [ new Date(2016, 3, 3, 7, 25), 25 ], [ new Date(2016, 3, 3, 7, 40), 17 ]];
			let now = new Date (2016, 3, 3, 7, 42);
			return expectTempToBe(17, now);
		});

		it("should revert to the schedule after the last override end time and the next time in the schedule", () => {
			schedule.override = [[ new Date(2016, 3, 3, 7, 25), 25 ]];
			let now = new Date (2016, 3, 3, 8, 0);
			return expectTempToBe(20, now);
		});

		it("should indicate that temperature is overridden when override is current", () => { 
			schedule.override = [ [ new Date(2016, 3, 3, 7, 25), 25 ] ];
			let now = new Date (2016, 3, 3, 7, 55);
			return getTarget(now).then(t => expect(t.override).toBe(true));
		});

		it("should indicate that temperature is overridden when override is in future", () => { 
			schedule.override = [ [ new Date(2016, 3, 3, 8, 30), 25 ] ];
			let now = new Date (2016, 3, 3, 7, 55);
			return getTarget(now).then(t => expect(t.override).toBe(true));
		});

		it("should indicate that temperature is not overridden when schedule has resumed", () => { 
			schedule.override = [ [ new Date(2016, 3, 3, 7, 25), 25 ] ];
			let now = new Date (2016, 3, 3, 8, 0);
			return getTarget(now).then(t => expect(t.override).toBe(false));
		});
	});

	it("should update when the schedule updates", () => {
		let now = new Date (2016, 3, 3, 10, 20); 		
		let updatedSchedule = { days: Array(7).fill([ [ "0800", 20 ], [ "1000", 15 ] ]) };
		let sequence = rx.Observable.of(schedule, updatedSchedule);
			
		return sut(sequence, rx.Observable.of(now))
			.first().toPromise()
			.then(a => expect(a.current).toBe(15));
	});

	describe("now and next", () => {
		it("should give the next time and temperature change", () => {
			let now = new Date (2016, 3, 3, 10, 20); // Sunday
			return getTarget(now).then(t => expect(t.next).toEqual([new Date(2016, 3, 3, 12, 0), 16]));
		});

		it("should give the next time and temperature change during an override", () => {
			schedule.override = [ [ new Date(2016, 3, 3, 8, 20), 25 ], [ new Date(2016, 3, 3, 9, 25), 18 ]];
			let now = new Date (2016, 3, 3, 8, 30); // Sunday
			return getTarget(now).then(t => expect(t.next).toEqual([new Date(2016, 3, 3, 9, 25), 18]));
		});

		it("should give the next time and temperature change after an override", () => {
			schedule.override = [[new Date(2016, 3, 3, 9, 25), 25]];
			let now = new Date (2016, 3, 3, 9, 30); // Sunday
			return getTarget(now).then(t => expect(t.next).toEqual([new Date(2016, 3, 3, 12, 0), 16]));
		});

		it("the next time should wrap around to the following day", () => {
			let now = new Date (2016, 3, 3, 18, 11);
			return getTarget(now).then(t => expect(t.next).toEqual([new Date(2016, 3, 4, 8, 0), 20]));
		});
	});
});