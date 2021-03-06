"use strict";
var assert = require("assert");
var rx = require("rxjs");
require('expectations');
let fs = require("fs");
var simple = require("simple-mock");

let fakeSchedule = { days: [] };

describe("schedule", () => {
	let sut = require("./schedule");

	beforeEach(() => {
		simple.mock(fs, "watch").callFn(() => {});
		simple.mock(fs, "readFile").callFn((fn, o, cb) => cb(null, JSON.stringify(fakeSchedule)));
	});

	it("reads from file on start", () => {
		return sut("filename.json").first().toPromise().then(r => expect(r).toEqual(fakeSchedule));
	});

	describe("override", () => {
		it("sets the override into the schedule", () => {
			var schedule = sut("filename.json");
			var promise = schedule.skip(1).first().toPromise().then(r => expect(r.override).toEqual(override));
			var override = [new Date(), 21.5];
			schedule.override(override[0], override[1]);
			return promise;
		});

		it("updates the schedule", () => {
			var schedule = sut("filename.json");
			var promise = schedule.skip(1).first().toPromise().then(r => expect(r.updated).toEqual(true));
			schedule.update({ days: [], updated: true });
			return promise;
		});
	});
});