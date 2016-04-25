"use strict";

let rx = require("rxjs");
let sensor = require("./sensor");
let targetTemp = require("./targetTemp");
let relay = require("./relay");
let controller = require("./controller");

let schedule = {
	
};

let time = rx.timer(0, 1000).map(_ => new Date());

module.exports = () => 
	controller.relayPositions(sensor, targetTemp
