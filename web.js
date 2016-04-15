var http = require("http");
var nodeStatic = require("node-static");
var weatherSensor = require("./weatherSensor");

var sensorConfig = {
    location: "GU85BY,UK",
    apiKey: "fec3e673e40c2bd7e653fde691adb046"
};

var staticServer = new nodeStatic.Server(".");

var server = http.createServer((request, response) => {
    if (/^\/static\/.+/.test(request.url)) {
        request.addListener("end", () => staticServer.serve(request, response)).resume();
    } else if (request.url == "/status") {
        weatherSensor(sensorConfig).fetch().then(temp => response.end(`It's ${temp} °C`));
    } else {
        response.statusCode = 404;
        response.end();
    }
});
    
 server.listen(2345);

 console.log("listening");

