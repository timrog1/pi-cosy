"use strict";

let port = process.argv[2] || 80;

var wiring = require("./wiring");
var express = require("express");
var bodyParser = require('body-parser')
var app = express();
var rx = require("rxjs");

['get', 'put', 'post', 'delete'].map(method =>
	app[method + "RequestsTo"] = url => 
	{
		var requests = new rx.Subject();
		app[method](url, (req, res) => requests.next({request: req, response: res}));
		return requests;
	});

app.use(bodyParser.json());

app.getRequestsTo('/status')
	.withLatestFrom(wiring.values, (x, status) => x.response.json(status) )
	.subscribe();
	
app.putRequestsTo('/schedule/override')
	.subscribe(x => {
		let body = x.request.body;
		if(body.length == 2){
			wiring.schedule.override(body[0], body[1]);
			x.response.sendStatus(201);
		}
		else
			x.response.sendStatus(400);
	});

app.use('/', express.static('static'));

app.listen(port, () => console.log("listening"));



