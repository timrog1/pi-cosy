"use strict";
var assert = require("assert");
var simple = require("simple-mock");
require('expectations');
describe("weatherSensor", () => {
	let sensor = require("./weatherSensor");
	let rest = require("./rest");
	
	let stubResponse = {
		main: {temp: 298.65}
	};
	
	beforeEach(() => 
		simple.mock(rest, "get").callFn(url => Promise.resolve(stubResponse)));
			
	it("should interpret current temperature from response", () => {
		let config = { location: "" };
		return sensor(config).first().toPromise()
			.then(temp => expect(temp).toBe(25.5));		
	});
	
	it("should fetch by configured location", () => {
		sensor({ location: "Guildford,UK", apiKey: "xyz" })
			.first().toPromise()
			.then(temp => expect(http.get.lastCall.args[0]).toBe("http://api.openweathermap.org/data/2.5/weather?q=Guildford,UK&APPID=xyz"));
	});
});