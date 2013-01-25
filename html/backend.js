var $ = function(e){return document.getElementById(e);};
var _ = function(type,init,inner){
	if(type == "textnode")
		return document.createTextNode(inner);
	var elem = document.createElement(type);
	for(var i in init){
		if(i != 'style'){
			elem[i] = init[i];
		}else{
			for(var j in init[i]){
				elem['style'][j] = init[i][j];
			}
		}
	}
	if(inner!=null)
		elem.appendChild(inner);
	return elem;
}
/*** Global Stuff ***/
var USER_ID = "";
function sendRequest(msg){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			try{
				var ret = JSON.parse(xhr.responseText);
			}catch(e){
				console.log("Communication Error - Return format invalid");
				return;
			}
			$("chattext").appendChild(_("div",{},_("textnode",{},ret.msg)));
			if(ret.uid != null)
				USER_ID = ret.uid;
		}
	};
	xhr.open("POST","/",true);
	xhr.send("msg=" + encodeURIComponent(msg) 
			+ (USER_ID != "" ? "&uid=" + encodeURIComponent(USER_ID) : ""));
	$("chattext").appendChild(_("div",{className:"chat-me"},_("textnode",{},"Me: " + msg)));
};

window.addEventListener("load",function(){
	$("chatinput").addEventListener("keydown",function(e){
		if(e.keyCode == 13){
			if(this.value != ""){
				sendRequest(this.value);
				this.value = "";
			}
		}
	});
});