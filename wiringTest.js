"use strict";

let wiring = require("./wiring");
let rx = require("rxjs");

wiring.relayPositions.subscribe(x => console.log("Relay is " + (x ? "on" : "off")));