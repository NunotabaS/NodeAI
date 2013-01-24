var http = require('http');
var url = require("url");
var ai = require('./ai/engine.js');
var PORT = 894;


http.createServer(function (request, response) {
	var req = url.parse(request.url, true);
	var resp = {};
	if(req.query.msg != null){
		if(req.query.uid != null)
			ai.setenv("uid",req.query.uid);
		resp = ai.speak(req.query.msg);
	}else{
		resp = {"code":500, "msg":"Error. You didn't provide a message."};
	}
	response.writeHead(200, {'Content-Type': 'application/json'});
	response.end(JSON.stringify(resp));
}).listen(PORT);

console.log('NodeAI has been started');