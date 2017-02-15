"use strict";
const sut = require("./override");
describe("override", () => {
	let fromTime = d => new Date(`2017-01-11T${d}:00`);
	let quickMap = a => a.map(([d, t]) => [fromTime(d), t]);
	let nowAndNext = quickMap([["08:00", 20], ["11:30", 16], ["17:00", 21]]);
	var override = { now: 20, until: "11:30", temporary: false }
	beforeEach(() => override = sut.extract(nowAndNext));

	it("should apply a change to the current temperature until the next change", () => {
		override.now = 23;
		expect(sut.apply(nowAndNext, override)).toEqual(quickMap([["08:00", 23], ["11:30", 16], ["17:00", 21]]));
	});

	it("should apply a temporary change to the current temperature", () => {
		override = { now: 23, until: fromTime("09:00"), temporary: true };
		expect(sut.apply(nowAndNext, override)).toEqual(quickMap([["08:00", 23], ["09:00", 20], ["11:30", 16], ["17:00", 21]]));
	});

	it("should apply a temporary change beyond the next temperature change", () => {
		override = { now: 23, until: fromTime("15:00"), temporary: true };
		expect(sut.apply(nowAndNext, override)).toEqual(quickMap([["08:00", 23], ["15:00", 16], ["17:00", 21]]));
	});

	it("should apply an earlier override to the next change time", () => {
		override.until = fromTime("11:00");
		expect(sut.apply(nowAndNext, override)).toEqual(quickMap([["08:00", 20], ["11:00", 16], ["17:00", 21]]));
	});

	it("should apply a later override to the next change time", () => {
		override.until = fromTime("12:00");
		expect(sut.apply(nowAndNext, override)).toEqual(quickMap([["08:00", 20], ["12:00", 16], ["17:00", 21]]));
	});

	it("should ignore changes before override time", () => {
		override.until = fromTime("18:00");
		expect(sut.apply(nowAndNext, override)).toEqual(quickMap([["08:00", 20], ["18:00", 21]]));
	});

	it("should have no effect if the override has already ended", () => {
		override.until = fromTime("07:00");
		expect(sut.apply(nowAndNext, override)).toEqual(quickMap([["08:00", 20], ["11:30", 16], ["17:00", 21]]));
	});
});