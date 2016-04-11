"use strict";
var assert = require("assert");
var simple = require("simple-mock");
require('expectations');
describe("targetTemp", () => {
	let sut = require("./targetTemp");

	let schedule = { days: [ 
		[ [ "0800", 20 ], [ "1200", 16 ] ],
		[ [ "0800", 20 ], [ "1200", 16 ] ],
		[ [ "0800", 20 ], [ "1200", 16 ] ],
		[ [ "0800", 20 ], [ "1200", 16 ] ],
		[ [ "0800", 20 ], [ "1200", 16 ] ],
		[ [ "0800", 20 ], [ "1200", 16 ] ],
		[ [ "0800", 20 ], [ "1200", 16 ] ],		
	] };

	it("should provide the target for the current time of day", () => {
		let now = new Date (2016, 3, 3, 10, 20); // Sunday
		expect(sut(schedule)(now)).toBe(20);
	});
	
	it("should provide the target before the first entry of the day", () => {
		let now = new Date (2016, 3, 5, 7, 20); 
		expect(sut(schedule)(now)).toBe(16);
	});
	
	it("should wrap around the week", () => {
		let now = new Date (2016, 3, 3, 7, 20); 
		expect(sut(schedule)(now)).toBe(16);
	});
});