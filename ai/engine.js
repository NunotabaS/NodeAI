var env = {};
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

function speak(dialog){
	
	return formMessage("Sorry, I dont understand.");
}

/** Module Interfaces **/
module.exports.speak = speak;
module.exports.setenv = setenv;