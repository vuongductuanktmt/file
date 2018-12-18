/**
 * Created by hongleviet on 7/10/14.
 */

//document.cookie =
// 'last_referrer=test;';

var ref = document.referrer;
var form = document.getElementById("cjsform");
var iframeResizer_src = "//88.cjs.vn/js/iframeResizer.min.js";
var form_url = form.getAttribute("src");
//if (form_url.indexOf("last_referrer") == -1) {
//
//    if (form_url.indexOf("?") > -1) {
//        form_url += "&last_referrer=" + ref
//    }
//    else {
//        form_url += "?last_referrer=" + ref
//    }
//
//    form.src = form_url;
//}


//update by Duan
//MDN PolyFil for IE8 (This is not needed if you use the jQuery version)
if (!Array.prototype.forEach){
	Array.prototype.forEach = function(fun /*, thisArg */){
	"use strict";
	if (this === void 0 || this === null || typeof fun !== "function") throw new TypeError();

	var
	t = Object(this),
	len = t.length >>> 0,
	thisArg = arguments.length >= 2 ? arguments[1] : void 0;

	for (var i = 0; i < len; i++)
	if (i in t)
		fun.call(thisArg, t[i], i, t);
	};
}


function cjs_loadIFrameResizerIfNotExisted(){
	if (typeof iFrameResize  != 'function') { 
		var script = document.createElement('script');
		script.onload = function() {
			
		    var s = document.createElement('script');
		    s.type = 'text/javascript';
		    var code = "/*do callback function for iframeResizer*/\
		    	iFrameResize({\
		    	log                     : false,                  /* Enable console logging*/\
		    	enablePublicMethods     : true,                  /* Enable methods within iframe hosted page*/\
		    	enableInPageLinks       : true,\
		    	checkOrigin: false,\
		    	resizedCallback         : function(messageData){ /* Callback fn when resize is received*/\
		    		/*$('p#callback').html(\
		    			'<b>Frame ID:</b> '    + messageData.iframe.id +\
		    			' <b>Height:</b> '     + messageData.height +\
		    			' <b>Width:</b> '      + messageData.width +\
		    			' <b>Event type:</b> ' + messageData.type\
		    		);*/\
		    		console.log('window resize');\
		    	},\
		    	messageCallback         : function(messageData){ /* Callback fn when message is received*/\
		    		/*alert('sadfasd');*/\
		    		/*\
		    		$('p#callback').html(\
		    			'<b>Frame ID:</b> '    + messageData.iframe.id +\
		    			' <b>Message:</b> '    + messageData.message\
		    		);\
		    	*/\
		    		/*alert(messageData.message);*/\
		    		console.log(messageData.message);\
		    		if(messageData.message.do_redirect){\
		    			location.href=messageData.message.redirect_url;\
		    		}\
		    	},\
		    	closedCallback         : function(id){ /* Callback fn when iFrame is closed*/\
		    		/*$('p#callback').html(\
		    			'<b>IFrame (</b>'    + id +\
		    			'<b>) removed from page.</b>'\
		    		);*/\
		    		console.log('close');\
		    	}\
		    });";
		    
		    try {
		      s.appendChild(document.createTextNode(code));
		      document.body.appendChild(s);
		    } catch (e) {
		      s.text = code;
		      document.body.appendChild(s);
		    }
		  
		};
		script.src = iframeResizer_src;
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}

function cjs_addLoadEvent(func) {
	  var oldonload = window.onload;
	  if (typeof window.onload != 'function') {
	    window.onload = func;
	  } else {
	    window.onload = function() {
	      if (oldonload) {
	        oldonload();
	     }
	      func();
	    }
	  }
}

cjs_addLoadEvent(cjs_loadIFrameResizerIfNotExisted);

