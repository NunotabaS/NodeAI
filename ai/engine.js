var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var listener = function(){};
var mongodb = null;
var env = {
	"dbname":"nodeai",
	"happiness":100
};
/** Classes **/
function Sentence(text){
	var children = [];
	this.text = text;
	this.context = {};
	this.amend = function (params){
		for(x in params){
			if(this.params[x] == null){
				this.params[x] = params[x];
				break;
			}
			switch(typeof params[x]){
				case "string":
					this.params[x] = params[x];break;
				case "number":
					this.params[x] += params[x];break;
				default:break;
			}
		}
	};
	this.addChild = function (childSentence){
		children.push(childSentence);
	};
	this.getChildren = function(){
		return children;
	};
	this.matchRule = function(rule){
		try{
			switch(rule.type){
				case "synonym":{
					this.text = this.text.replace(new RegExp(rule.matcher,"g"),rule.sameword);
				}break;
				case "word":{
					var matcher = new RegExp(rule.matcher, "g");
					if(matcher.test(this.text)){
						this.amend(r.set);
						this.text = this.text.replace(matcher, rule.part);
					}
				}break;
				case "logic":{
					var matcher = new RegExp(rule.matcher, "g");
					if(matcher.test(this.text)){
						var nm = new RegExp(rule.filter, "g");
						var matn = nm.exec(this.text);
						for(var x = 0; x < rule.fields.length; x++){
							this.addChild(parse(new Sentence(matn[x+1]), rule.fields[x]));
						}
					}
				}
			}
		}catch(e){
			console.log(e);
			console.log("[Error] Illegal rule! Dumping:");
			console.log(rule);
		}
	};
	this.toString = function (){
		var dump = this.text + "\n" + JSON.stringify(this.context) + "\n";
		for(var x = 0; x < children.length; x++){
			dump += "Child: " + children[x].toString();
		}
		return dump;
	};
}


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

function parse(sentence, expect){
	if(expect == null){
		/** Parsing a Global Large Sentence **/
		var stream = mongodb.collection("rules").find({type:"logic"}).stream();
		stream.on("data", function(item) {
			sentence.matchRule(item);
		});
		stream.on("end", function() {
			listener(formMessage(sentence.toString()));
		});
	}else{
		return sentence;
	}
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
	parse(new Sentence(dialog));
	//return onHandleError("cannotRespond");
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