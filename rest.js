"use strict";
let http = require("http");

module.exports = {
	get: function(url) {
		 //let options = {
		 //	host: "proxy",
		 //	port: 8080,
		 //	path: url,
		 //	headers: {
		 //		Host: /\w+\:\/\/([^\/]+).*/.exec(url)[1]
		 //	}
		 //};

		return new Promise((resolve, reject) => {
			console.log("Fetching " + url);
			http.get(url,
		        response => {
		            var body = "";
		            response.on("data", chunk => body += chunk);
		            response.on("end", () => resolve(JSON.parse(body)));
		            response.on("error", () => reject(JSON.parse(body)));
	            }).on("error", e => reject(e));
			});
	}
};
