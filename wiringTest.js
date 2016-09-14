"use strict";

let wiring = require("./wiring");

wiring.subscribe(x => console.log(JSON.stringify(x)));