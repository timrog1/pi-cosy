"use strict";

let port = process.argv[2] || 80;

var wiring = require("./wiring");
var express = require("express");
var bodyParser = require('body-parser')
var app = express();
var rx = require("rxjs");
var config = require("./config.json");
var request = require("request-json");

let reviveDates = (k, v) => /^\d{4}-\d{2}-\d{2}/.test(v) ? new Date(v) : v;
app.use(bodyParser.json({ reviver: reviveDates }));

if(config.googleAuth) require("./google-auth")(app, config.googleAuth);

['get', 'put', 'post', 'delete'].map(method =>
	app[method + "RequestsTo"] = url => 
	{
		var requests = new rx.Subject();
		app[method](url, (req, res) => requests.next({request: req, response: res}));
		return requests;
	});

app.getRequestsTo('/status')
	.withLatestFrom(wiring.values, (req, values) => [ req, values ] )
	.subscribe(([req, values]) => req.response.json(values));

app.deleteRequestsTo('/schedule/override')
	.subscribe(x => { 
		wiring.schedule.clearOverride();
		x.response.sendStatus(201);
	});
	
app.putRequestsTo('/schedule/override')
	.subscribe(x => {
		let body = x.request.body;
		if(body.now != undefined && body.until != undefined){
			wiring.schedule.override(body);
			x.response.sendStatus(201);
		}
		else
			x.response.sendStatus(400);
	});

let babel = require('express-babelify-middleware');
app.use('/console.js', babel('static/console.js'));
app.use(express.static('static'));

app.use((req, res) => res.status(404).send("Not found"));

app.listen(port, () => console.log("listening"));



