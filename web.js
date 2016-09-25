var http = require("http");
var nodeStatic = require("node-static");
var wiring = require("./wiring");

var staticServer = new nodeStatic.Server(".");

var server = http.createServer((request, response) => {
    if (/^\/static\/.+/.test(request.url)) {
        request.addListener("end", () => staticServer.serve(request, response)).resume();
    } else if (request.url == "/status") {
        wiring.first().subscribe(status => response.end(JSON.stringify(status)));
    } else {
        response.statusCode = 404;
        response.end();
    }
});
    
server.listen(80);

console.log("listening");
