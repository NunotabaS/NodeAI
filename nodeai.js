var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
var ai = require('./ai/engine.js');

var PORT = 894;
var NODEAI_VERSION = "Version 0.1";
var PROD_CONSTANTS = {
	"BOT_NAME":"Asuna"
};

var args = process.argv.splice(2);
if(args != null && args.length >0){
	try{
		PORT = parseInt(args[0]);
	}catch(e){
		console.log("[Error] Port Invalid, Reverting to 894");
		PORT = 894;
	}
}

ai.setenv("botid","asuna");

function dumpFile(file, contenttype, response){
	var generate404 = function (){
		response.writeHead(404, {"Content-Type": "text/html"});
		response.end("<html><head><title>404 File Not Found</title></head><body>"
			+ "<h2>404 - File Not Found</h2><p>File was not found on the server!"
			+ " Please check your URL.</p><hr><p><small>Powered by NodeAI HTTP ("
			+ NODEAI_VERSION
			+")</small></p></body></html>");
		return;
	};
	if(file == null)
		return generate404();
	fs.readFile(file, "utf8", function(err,data){
		if(err){
			generate404();
			return;
		}
		if(contenttype == "text/html"){
			for(dx in PROD_CONSTANTS){
				data = data.replace(new RegExp("\\{\\$" + dx + "\\}","g"), PROD_CONSTANTS[dx]);
			}
		}
		response.writeHead(200, {"Content-Type": contenttype});
		response.end(data);
		return;
	});
}

function callAI(params, request, response){
	var resp = {};
	if(params.uid != null)
		ai.setenv("uid", params.uid);
	else
		ai.setenv("uid", null);
	ai.listen(function(resp){
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.end(JSON.stringify(resp));
	});
	
	if(params.msg != null){
		ai.speak(params.msg);
	}else{
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.end(JSON.stringify({
			"code":500, 
			"msg":"Error. You didn't provide a message."
		}));
	}
	
}

http.createServer(function (request, response) {
	var req = url.parse(request.url, true);
	if(req.pathname != null && req.pathname.substring(0,10) == "/interface"){
		var fileName = req.pathname.substring(11);
		switch(fileName){
			case "backend.js":
				dumpFile("html/backend.js", "application/javascript", response);break;
			case "style.css":
				dumpFile("html/style.css", "text/css", response);break;
			case "default.html":
			case "default.htm":
			case "index.htm":
			case "index.html":
			case "":dumpFile("html/interface.html", "text/html", response);break;
			default:dumpFile(null,"", response);
		}
		return;
	}
	if(request.method == "POST"){
		var body = "";
		request.on("data", function(data){
			body += data;
		});
		request.on("end", function(){
			try{
				var post = qs.parse(body);
			}catch(e){ console.log("Error: Post Invalid"); 
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.end(JSON.stringify({"code":501, "msg":"Invalid Message."}));
				return;
			}
			callAI(post, request, response);
		});
		return;
	}
	callAI(req.query, request, response);
}).listen(PORT);

console.log('[Log] NodeAI has been started on server 127.0.0.1:' + PORT);