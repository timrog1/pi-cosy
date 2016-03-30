"use strict";
var http = require('http');
var sensor = require('./sensor');

http.createServer(
	(request, response) => 
		sensor(temp => {
			response.setHeader("Content-Type", "text/html; charset=utf-8");
			response.end(`
				<html>
					<head>
					</head>
					<body>
					<h1 style="font-family:Segoe UI Light;font-size:108px">${temp}°</h1>
					</body>
				</html>
			`);
		})
	).listen(80);