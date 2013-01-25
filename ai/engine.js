var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var listener = function(){};
var mongodb = null;
var env = {
	"dbname":"nodeai"
};

function dbConnect(){
	mongoClient.connect("mongodb://localhost:27017/" + env['dbname'], function(err, db) {
		if(!err) {
			console.log("[Log] MongoDB Connected.");
			mongodb = db;
		}
	});
}

function formMessage(message, code){
	if(code == null)
		code = 200;
	return {
		"code":code,
		"msg":message
	};
}

function matchRule(sentence, rule, context){
	if((new RegExp(rule.regex)).test(sentence)){
		context = rule.context;
	}
	return context;
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

function speak(dialog){
	if(mongodb == null) return onHandleError("dbNotInitialized");
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