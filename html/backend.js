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
			$("chattext").appendChild(_("div",{},
							_("textnode",{},(bot_name != null ? bot_name + ": " : "") + ret.msg)
						));
			if(ret.uid != null)
				USER_ID = ret.uid;
			if(ret.code == 206){
				/** Partial **/
				setTimeout(function(){
					sendRequest("");
				},500);
			}
		}
	};
	xhr.open("POST","/",true);
	xhr.send("msg=" + encodeURIComponent(msg) 
			+ (USER_ID != "" ? "&uid=" + encodeURIComponent(USER_ID) : ""));
	if(msg.length > 0){
		$("chattext").appendChild(_("div",{className:"chat-me"},_("textnode",{},"Me: " + msg)));
	}
};

window.addEventListener("load",function(){
	$("chatinput").addEventListener("keydown",function(e){
		if(e.keyCode == 13){
			if(this.value != ""){
				if(this.value.charAt(0) == ":"){
					switch(this.value){
						case ":help":
							var d = _("div",{style:{color:"#fff"}});
							d.appendChild(_("textnode",{},"Client::Help"));
							d.appendChild(_("br",{}));
							d.appendChild(_("textnode",{},":clear - Clears the chatbox"));
							$("chattext").appendChild(d);
							break;
						case ":clear":
							var c = $("chattext");
							while(c.children.length > 0)
								c.removeChild(c.children[0]);
							break;
						default:
							$("chattext").appendChild(
								_("div",{style:{color:"#fff"}},_("textnode",{},
									"\"" + this.value.substring(1) + "\" : Bad Command")));
							break;
					}
				}else{
					sendRequest(this.value);
				}
				this.value = "";
			}
		}else{
			if(this.value.charAt(0) == ":")
				this.style.color = "#f22";
			else
				this.style.color = "";
		}
	});
	$("chatinput").focus();
});