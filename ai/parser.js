// This creates a natural language simplifing parse tree
var db = new function(){
	this.find();
}
function parse(sentence){
	db.find(sentence);
	return ;
}

module.exports.parse = parse;