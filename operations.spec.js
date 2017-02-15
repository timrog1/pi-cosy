"use strict";
const ops = require("./static/operations");
describe("operations", () => {
	let fromTime = d => new Date("2017-01-11T" + d + ":00");
	let now = fromTime("08:25");

	describe("time operations", () => { 
		it("should increment next change to next 30 min interval", () => 
			expect(ops.time.increment({ now: 16, until: fromTime("09:25")}, now)).toEqual({ now: 16, until: fromTime("09:30"), temporary: false}));
		it("should increment next change to next 30 min interval", () => 
			expect(ops.time.increment({ now: 16, until: fromTime("11:30")}, now)).toEqual({ now: 16, until: fromTime("12:00"), temporary: false}));

		it("should decrement next change to previous 30 min interval", () => 
			expect(ops.time.decrement({ now: 16, until: fromTime("09:25")}, now)).toEqual({ now: 16, until: fromTime("09:00"), temporary: false}));
		it("should decrement next change to previous 30 min interval", () => 
			expect(ops.time.decrement({ now: 16, until: fromTime("09:00")}, now)).toEqual({ now: 16, until: fromTime("08:30"), temporary: false}));

		it("should not decrement beyond current time", () => 
			expect(ops.time.decrement({ now: 16, until: fromTime("08:30")}, now)).toEqual({ now: 16, until: fromTime("08:25"), temporary: false}));
	});

	describe("temperature operations", () => { 
		it("should increment temperature for a 1 hour temporary period", () => 
			expect(ops.temp.increment({ now: 16, until: fromTime("11:30")}, now)).toEqual({ now: 17, until: fromTime("09:25"), temporary: true}));

    	it("should leave times alone if temporary flag already set", () => 
			expect(ops.temp.increment({ now: 16, until: fromTime("11:30"), temporary: false }, now))
				.toEqual({ now: 17, until: fromTime("11:30"), temporary: false }));

		it("should decrement temperature until next temperature change", () => 
			expect(ops.temp.decrement({ now: 16, until: fromTime("11:30")}, now)).toEqual({ now: 15, until: fromTime("11:30"), temporary: true}));
	});
});