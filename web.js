var wiring = require("./wiring");
var express = require("express");
var app = express();

app.get('/status', (request, response) => 
	wiring.first().subscribe(status => response.json(status)));

app.use('/', express.static('static'));

app.listen(80, () => console.log("listening"));
