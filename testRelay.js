let relay = require("./relay.js");
let arg = process.argv[2];
switch (arg){
	case "1": relay.set(1); break;
	case "0": relay.set(0); break;
	default: throw "Cannot get value";
}
