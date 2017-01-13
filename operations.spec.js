"use strict";
const ops = require("./static/operations");
describe("operations", () => {
	let quickMap = a => a.map(([d, t]) => [new Date("2017-01-11T" + d + ":00"), t]);
	let test = (fn, source, expected) => expect(fn(quickMap(source))).toEqual(quickMap(expected));

	describe("time operations", () => { 
		it("should increment next change to next 30 min interval", () => 
			test(ops.time.increment, [["08:00", 20], ["11:08", 16]], [[ "08:00", 20], ["11:30", 16]]));
		it("should increment next change to next 30 min interval", () => 
			test(ops.time.increment, [["08:00", 20], ["11:30", 16]], [[ "08:00", 20], ["12:00", 16]]));
		it("should remove time change when incrementing into the next block", () => 
			test(ops.time.increment, [["08:00", 20], ["11:30", 16], ["11:45", 10]], [[ "08:00", 20], ["12:00", 10]]));


		it("should decrement next change to previous 30 min interval", () => 
			test(ops.time.decrement, [["08:00", 20], ["11:08", 16]], [[ "08:00", 20], ["11:00", 16]]));
		it("should decrement next change to previous 30 min interval", () => 
			test(ops.time.decrement, [["08:00", 20], ["11:00", 16]], [[ "08:00", 20], ["10:30", 16]]));
		it("should merge with current temp when decrementing to current time", () => 
			test(ops.time.decrement, [["08:17", 20], ["08:30", 16]], [[ "08:17", 16 ]]));
	});

	describe("temperature operations", () => { 
		it("should increment temperature for a 1 hour period where next change > 1h", () => 
			test(ops.temp.increment, [["08:00", 20], ["11:08", 16]], [[ "08:00", 21], [ "09:00", 20 ], ["11:08", 16]]));
		it("should increment temperature for a 1 hour period where next change <= 1h", () => 
			test(ops.temp.increment, [["08:00", 20], ["08:45", 16]], [[ "08:00", 21], [ "09:00", 16 ]]));
		it("should increment temperature for a 1 hour period where more than one next change <= 1h", () => 
			test(ops.temp.increment, [["08:00", 20], ["08:30", 16], ["08:45", 15]], [[ "08:00", 21], [ "09:00", 15 ]]));

		it("should decrement temperature until next temperature change", () => 
			test(ops.temp.decrement, [["08:00", 20], ["11:08", 16]], [[ "08:00", 19], ["11:08", 16]]));
	});
});