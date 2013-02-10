var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var listener = function(){};
var mongodb = null;
var env = {
	"dbname":"nodeai",
	"happiness":100
};
/** Active Sessions **/
var sesn = {
	"next":0,
};

function dbConnect(){
	mongoClient.connect("mongodb://localhost:27017/" + env['dbname'], function(err, db) {
		if(!err) {
			console.log("[Log] MongoDB Connected.");
			mongodb = db;
		}
	});
}

function formMessage(message, code, xobj){
	if(code == null)
		code = 200;
	var r = {
		"code":code,
		"msg":message
	};
	if(xobj != null)
		for(n in xobj)
			r[n] = xobj[n];
	return r;
}

function openSession(){
	var id = ++sesn.next;
	sesn[id] = {};
	return id;
}

function setenv(key, value){
	env[key] = value;
}

function onHandleError(errorCode){
	/** Try to handle some errors as well **/
	switch(errorCode){
		case "dbNotInitialized":dbConnect();break;
	}
	fs.readFile("messages/error." + (env["botid"] != null ? env["botid"] : "predef") + ".json"
				, "utf8"
				, function(err,data){
		if(err) return listener(formMessage("Response Undefined."));
		try{
			var MSG = JSON.parse(data);
			if(MSG[errorCode] != null)
				return listener(formMessage(MSG[errorCode]));
		}catch(e){
			console.log("[Error] Response Parse Error");
			listener(formMessage("Response defined wrong!"));
		}
		return;
	});
}

function onMessage(messageCode, messageBase){
	fs.readFile("messages/messages." + (env["botid"] != null ? env["botid"] : "predef") + ".json"
				, "utf8"
				, function(err,data){
		if(err) return listener(formMessage("[" + messageCode + "] : Undefined"));
		try{
			var MSG = JSON.parse(data);
			if(MSG[messageCode] != null){
				if(messageBase["code"] == 206){
					sesn[messageBase["uid"]]["next"] = MSG["_" + messageCode];
				}
				return listener(formMessage(MSG[messageCode], 200 , messageBase));
			}else
				return listener(formMessage("[" + messageCode + "] : Undefined"));
		}catch(e){
			console.log("[Error] Response Parse Error");
			listener(formMessage("[" + messageCode + "] : ParseError"));
		}
		return;
	});
}

function speak(dialog){
	//if(mongodb == null) return onHandleError("dbNotInitialized");
	if(env["uid"] == null){
		if(dialog.substring(0,6) == "/teach"){
			var sessionId = openSession();
			sesn[sessionId]["mode"] = "teach";
			return onMessage("enterTeachMode", {
				uid: sessionId,
				code:206
			} );
		}
	} else {
		if(sesn[env["uid"]] == null){
			env["uid"] = null;
			speak(dialog);
			return;
		}
		if(sesn[env["uid"]]["next"] != null){
			var resp = sesn[env["uid"]]["next"];
			sesn[env["uid"]]["next"] = null;
			return listener(formMessage(resp));
		}
		switch(sesn[env["uid"]]["mode"]){
			case "teach":{
				
			}break;
			default:break;
		}
	}
	return onHandleError("cannotRespond");
}

function listen(l){
	if(l != null)
		listener = l;
}

/** Preloaded at the very beginning **/
dbConnect();
/** Module Interfaces **/
module.exports.speak = speak;
module.exports.setenv = setenv;
module.exports.listen = listen;