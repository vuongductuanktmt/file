// JavaScript Document

var frame = document.getElementById("frame");
var loading = document.getElementById("loading");
var topbar = document.getElementById("top");
var slide = document.getElementById("slide");
var controls = document.getElementById("controls");
var slidePanel = document.getElementById("slide_panel");
var transPanel = document.getElementById("trans_panel");

var list = document.getElementById("list");
var time = document.getElementById("time");
var btnPlayPause = document.getElementById("btn_play_pause");
var btnSlides = document.getElementById("btn_slides");
var btnTrans = document.getElementById("btn_trans");

var slides =  $.parseJSON($("#slides").val());

var audios = $.parseJSON($("#audios").val());


//var audio = new Audio();
var audio = new Audio();

audio.addEventListener("abort", function(){
                       console.log("Slide "+currSlide+"- audio aborted");
                       time.innerHTML = "Loading ...";
                       }, false);

audio.addEventListener("loadstart", function(){
                        time.innerHTML = "Loading ...";
                       
                       }, false);


var loadtime = 1
audio.addEventListener("durationchange", function(){
                       
                       console.log("Audio duration changed - "+audio.duration);
					   if (!audio.duration || audio.duration == Infinity) {
						   console.log("Audio reloaded");

                           if (loadtime == 1){

                               audio.load();

                               loadtime ++;

                           }


						   time.innerHTML = "Loading ...";
					   }
                       
                       }, false);

audio.addEventListener("loadeddata", function(){
                       
                       console.log("Audio "+currSlide+" data loaded - "+audio.duration);
					   if (audio.duration) {
							playPause();
							btnPlayPause.style.backgroundPosition = "0px -40px";
					   }
                       
                       
                       }, false);
audio.addEventListener("playing", function(){console.log("Audio playback starts");}, false);
audio.addEventListener("timeupdate", function(){checkPlayEnd();}, false);
audio.addEventListener("ended",onAudioEnd, false);



var totalSlides = 0;
var currSlide = 0;

var imOriWidth = 720;
var imOriHeight = 540;
var topHeight = 40;
var btmHeight = 60;

var uiHeight;





function startApp() {
	loading.style.display = "block";
	topbar.style.display = "none";
	slide.style.display = "none";
	controls.style.display = "none";
	slidePanel.style.height = "0px";
	transPanel.style.height = "0px";
	if (navigator.userAgent.indexOf("Safari") == -1) {
		slidePanel.style.display = "none";
		transPanel.style.display = "none";
	}
	
	updateUI();	
	//loadData();
    getInfoListNew();
	
	
}













//get xmlHTTP object
var xmlHttp; 
function GetXmlHttpObject() {
	var xmlHttp = null;
	try	{
		// Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	} catch (e)	{
		//Internet Explorer
		try	{
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e)	{
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return xmlHttp;
}



// load file data
function loadData() {
	xmlHttp = GetXmlHttpObject();
	if (xmlHttp == null) {
		alert ("Browser does not support HTTP Request");
		return;
	}
	
	var url = "info.xml";
	xmlHttp.onreadystatechange = afterLoadData;
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);	
}

// processing file data
function afterLoadData() {
	if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        if (xmlHttp.status == 200 || xmlHttp.status == 0) {
			getInfoList(xmlHttp.responseText);
        } else {
            alert("There was a problem retrieving the slides info data:\n" + xmlHttp.statusText);
        }
    }
}

function getInfoList(q) {
	var parser = new DOMParser();
  	var xmlData = parser.parseFromString(q,"text/xml");
	
	var slide_array = xmlData.getElementsByTagName("slide");
	var slide_title = xmlData.getElementsByTagName("lecture")[0].getAttribute("name");
    
    	
	topbar.innerHTML = slide_title;
	
	clearFileList();
	for (i = 0; i < slide_array.length; i++) {
		var option = document.createElement("option");
        var strtmp = slide_array[i].getAttribute("label");
        
        if (strtmp == "") {
            option.text = "Slide "+String(i+1);
        } else {
            option.text = String(i+1)+". "+strtmp;
            
        }
		
		list.add(option, null);
	}
	
	//totalSlides = slide_array.length;
    totalSlides = slides.length;
	currSlide = 0;
	
	var div = document.createElement("div");
	div.id = "slideRow";
	div.setAttribute("style","left:0px;");
	slidePanel.appendChild(div);
	
	loadSlides();
}

function getInfoListNew() {
    //var parser = new DOMParser();
    //var xmlData = parser.parseFromString(q,"text/xml");

    //var slide_array = xmlData.getElementsByTagName("slide");
    //var slide_title = xmlData.getElementsByTagName("lecture")[0].getAttribute("name");


    topbar.innerHTML = "";

    clearFileList();
    for (i = 0; i < slides.length; i++) {
        var option = document.createElement("option");
        var strtmp = "";//slide_array[i].getAttribute("label");

        if (strtmp == "") {
            option.text = "Slide "+String(i+1);
        } else {
            option.text = String(i+1)+". "+strtmp;

        }

        list.add(option, null);
    }

    //totalSlides = slide_array.length;
    totalSlides = slides.length;
    currSlide = 0;

    var div = document.createElement("div");
    div.id = "slideRow";
    div.setAttribute("style","left:0px;");
    slidePanel.appendChild(div);

    loadSlides();
}


// clear file list
function clearFileList() {
	for (i = list.options.length-1; i > 0 ; i--) {
		list.remove(i);
	}
}


function loadSlides() {


    var slideRow = document.getElementById("slideRow");


	if (currSlide < totalSlides) {


		currSlide = currSlide + 1;
		
		var percent = Math.round(100*currSlide/totalSlides);
		loading.innerHTML = "Loading ... "+percent+" %";
		
		var img = document.createElement("img");
		img.id = "Slide"+currSlide;
		img.onload = loadSlides;
		
		img.className = "slideThumb";
		img.setAttribute("style","left:"+String(10*currSlide+80*(currSlide-1))+"px");
		img.setAttribute("onclick","loadOneSlide("+currSlide+")");
		img.setAttribute("ontouchend","loadOneSlide("+currSlide+")");
		//img.src = "slides/Slide"+currSlide+".jpg";

        img.src =slides[currSlide-1]["url"];


		slideRow.appendChild(img);
	} else {
		loading.innerHTML = "";
		loading.style.display = "none";
		slide.style.display = "block";
		
		btnPlayPause.addEventListener("click", playPause, false);
		btnSlides.addEventListener("click", showHideSlidePanel, false);
		btnTrans.addEventListener("click", showHideTransPanel, false);
		//frame.addEventListener("click", showHideSlidePanel, false);
		//slide.addEventListener("click", showHideSlidePanel, false);
		list.addEventListener("change", onChangeList, false);
		
		slideRow.style.width = String(10*(totalSlides+1)+80*totalSlides)+"px";
		
		currSlide = 1;
		loadOneSlide(currSlide);
	}

}

function loadOneSlide(q) {
	console.log("Load slide "+q);

	currSlide = q;
	slide.src = document.getElementById("Slide"+q).src;	

	audio.pause();
	var audioURL = "";

    //alert("check audio");

	if ( "" != audio.canPlayType('audio/wav; codecs="1"')) {
		console.log("MP4 audio support - "+audio.canPlayType('audio/wav; codecs="1"'));
		//audioURL = "audio/"+currSlide+".wav";

        audioURL = audios[currSlide-1].url;

        //alert("check wav");

	} else {
	
		if ( "" != audio.canPlayType('audio/ogg; codecs="vorbis"')) {
			console.log("OGG audio support - "+audio.canPlayType('audio/ogg; codecs="vorbis"'));
			audioURL = "audio/"+currSlide+".ogg";
		} else {
			alert("Your device doesn't include the required HTML5 audio support. The system is loading the Flash Player based e-lecture for you now.");
			window.location.href = "index_fl.html";
		}
	}
	
	
	audio.src = audioURL;
	audio.load();
		
	for (i = 1; i <= totalSlides; i++) {
		document.getElementById("Slide"+i).style.webkitBoxShadow = "none";
		document.getElementById("Slide"+i).style.boxShadow = "none";
		document.getElementById("Slide"+i).style.borderBottom = "";
	}
	document.getElementById("Slide"+q).style.webkitBoxShadow = "0px 0px 30px #0f0";
	document.getElementById("Slide"+q).style.boxShadow = "0px 0px 30px #0f0";
	document.getElementById("Slide"+q).style.borderBottom = "solid 4px #0f0";
	list.selectedIndex = q-1;
	
	if (!audio.paused) {
		btnPlayPause.style.backgroundPosition = "0px -40px";	
	}
	
	
	if (transPanel.style.height != 0) {
		loadTrans(currSlide);
	}
}

function onAudioEnd() {
	console.log("Slide "+currSlide+"- audio ended"); 
	//if (navigator.userAgent.indexOf("Firefox") != -1 && navigator.userAgent.indexOf("Windows") != -1) {
	//	nextSlide();
	//}
}

function checkPlayEnd() {
	var minStr1 = "00";
	var secStr1 = "00";
	var minStr2 = "00";
	var secStr2 = "00";
	
		
		
	if (audio.duration) {
		if (Math.floor(Math.ceil(audio.duration)/60) == 0) {
			minStr1 = "00";
		} else if (Math.floor(Math.ceil(audio.duration)/60) > 0 && Math.floor(Math.ceil(audio.duration)/60) < 10) {
			minStr1 = "0" +String(Math.floor(Math.ceil(audio.duration)/60));
		} else {
			minStr1 = String(Math.floor(Math.ceil(audio.duration)/60));
		}
		if (Math.ceil(audio.duration)%60 == 0) {
			secStr1 = "00";
		} else if (Math.ceil(audio.duration)%60 > 0 && Math.ceil(audio.duration)%60 < 10) {
			secStr1 = "0" +String(Math.ceil(audio.duration)%60);
		} else {
			secStr1 = String(Math.ceil(audio.duration)%60);
		}
	
	
		if (Math.floor(Math.ceil(audio.currentTime)/60) == 0) {
			minStr2 = "00";
		} else if (Math.floor(Math.ceil(audio.currentTime)/60) > 0 && Math.floor(Math.ceil(audio.currentTime)/60) < 10) {
			minStr2 = "0" +String(Math.floor(Math.ceil(audio.currentTime)/60));
		} else {
			minStr2 = String(Math.floor(Math.ceil(audio.currentTime)/60));
		}
		if (Math.ceil(audio.currentTime)%60 == 0) {
			secStr2 = "00";
		} else if (Math.ceil(audio.currentTime)%60 > 0 && Math.ceil(audio.currentTime)%60 < 10) {
			secStr2 = "0" +String(Math.ceil(audio.currentTime)%60);
		} else {
			secStr2 = String(Math.ceil(audio.currentTime)%60);
		}
	}
	
	
	
	//if (!(navigator.userAgent.indexOf("Firefox") != -1 && navigator.userAgent.indexOf("Windows") != -1)) {
		
	time.innerHTML = minStr2+":"+secStr2+" / "+minStr1+":"+secStr1;
	if (audio.currentTime >= audio.duration) {
		nextSlide();
	}
	//} else {
		//time.innerHTML = minStr2+":"+secStr2;
	//}
}



function nextSlide() {
	if (currSlide < totalSlides) {
		currSlide++;
		loadOneSlide(currSlide);
		
	} else {
		btnPlayPause.style.backgroundPosition = "0px 0px";
        time.innerHTML = "00:00 / 00:00";
	}
	
}


function playPause() {
	if (audio != null) {
		if (audio.paused) {
			btnPlayPause.style.backgroundPosition = "0px -40px";
			audio.play();
		} else {
			btnPlayPause.style.backgroundPosition = "0px 0px";
			audio.pause();
		}
	}	
}

function showHideSlidePanel() {
	if (slidePanel.style.height == "0px") {
		slidePanel.style.height = "110px";
		
		if (navigator.userAgent.indexOf("Safari") == -1) {
			slidePanel.style.display = "block";
		}
		btnSlides.style.backgroundPosition = "0px -40px";	
		
	} else {
		slidePanel.style.height = "0px";	
		if (navigator.userAgent.indexOf("Safari") == -1) {
			slidePanel.style.display = "none";
		}
		btnSlides.style.backgroundPosition = "0px 0px";	
	}
}

var transHeight = 0;
function showHideTransPanel() {
	
	
	if (transPanel.style.height == "0px") {
		transHeight = Math.floor((window.innerHeight-topHeight-btmHeight)/3);
		transPanel.style.height = transHeight+"px";
		
		if (navigator.userAgent.indexOf("Safari") == -1) {
			transPanel.style.display = "block";
		}
		btnTrans.style.backgroundPosition = "0px -40px";	
		
	} else {
		transHeight = 0;
		transPanel.style.height = "0px";	
		if (navigator.userAgent.indexOf("Safari") == -1) {
			transPanel.style.display = "none";
		}
		btnTrans.style.backgroundPosition = "0px 0px";	
	}
	
	oadTrans(currSlide);
	
	formatImage();
}



function onChangeList() {
	loadOneSlide(list.selectedIndex+1);	
}

function updateUI() {
	
	uiHeight = window.innerHeight;

	topbar.style.display = "block";
	topHeight = 40;
	controls.style.display = "block";
	btmHeight = 60;
	
	if (document.getElementById("slideRow")) {
		var slideRow = document.getElementById("slideRow");
		if (slideRow.offsetWidth+Number(slideRow.style.left.substr(0,slideRow.style.left.length-2)) < window.innerWidth) {
			slideRow.style.left = "-"+String(slideRow.offsetWidth-window.innerWidth)+"px";
		}
		//alert(slideRow.offsetWidth);
	}
	
	if (transHeight != 0) {
		transHeight = Math.floor((window.innerHeight-topHeight-btmHeight)/3);
		transPanel.style.height = transHeight+"px";

	}
	
	formatImage();

}









function formatImage() {
	var image = document.getElementById("slide");
	
	var imWidth = imOriWidth;
	var imHeight = imOriHeight;
	
	var frameWidth = window.innerWidth;
	var frameHeight = window.innerHeight-topHeight-btmHeight;
	
	if (transHeight != 0) {
		frameHeight = uiHeight-topHeight-btmHeight-transHeight;
	}
	//console.log(frameHeight);
	
	
	var imReWidth, imReHeight;
	if (frameWidth >= imWidth && frameHeight >= imHeight) {
		imReWidth = imWidth;
		imReHeight = imHeight;
		image.setAttribute("width",imReWidth);
		image.setAttribute("height",imReHeight);
		image.style.left = "50%";
		image.style.top = String(Math.round((frameHeight-imReHeight)/2)+topHeight)+"px";
		image.style.marginLeft = String(-Math.round(imReWidth/2))+"px";
	} else if (frameWidth >= imWidth && frameHeight < imHeight) {
		imReWidth = Math.round(frameHeight*imWidth/imHeight);
		imReHeight = frameHeight;		
		image.setAttribute("width",imReWidth);
		image.setAttribute("height",imReHeight);
		//image.setAttribute("style", "left:50%; top:"+topHeight+"px; margin-left:-"+String(Math.round(imReWidth/2))+"px;");
		image.style.left = "50%";
		image.style.top = String(topHeight)+"px";
		image.style.marginLeft = String(-Math.round(imReWidth/2))+"px";
	} else if (frameWidth < imWidth && frameHeight >= imHeight) {
		imReWidth = frameWidth;
		imReHeight = Math.round(frameWidth*imHeight/imWidth);
		image.setAttribute("width", imReWidth);
		image.setAttribute("height", imReHeight);
		//image.setAttribute("style", "left:0px; top:"+String(Math.round((frameHeight-imReHeight)/2)+topHeight)+"px;");
		image.style.left = "0px";
		image.style.top = String(Math.round((frameHeight-imReHeight)/2)+topHeight)+"px";
		image.style.marginLeft = "0px";
	} else if (frameWidth < imWidth && frameHeight < imHeight) {
		var imRatio = imWidth/imHeight;
		var frameRatio = frameWidth/frameHeight;
		
		if (frameWidth >= frameHeight) {
			if (imRatio < frameRatio) {
				imReWidth = Math.round(frameHeight*imWidth/imHeight);
				imReHeight = frameHeight;		
				image.setAttribute("width",imReWidth);
				image.setAttribute("height",imReHeight);
				//image.setAttribute("style", "left:50%; top:"+topHeight+"px; margin-left:-"+String(Math.round(imReWidth/2))+"px;");
				image.style.left = "50%";
				image.style.top = String(topHeight)+"px";
				image.style.marginLeft = String(-Math.round(imReWidth/2))+"px";
			} else {
				imReWidth = frameWidth;
				imReHeight = Math.round(frameWidth*imHeight/imWidth);
				image.setAttribute("width", imReWidth);
				image.setAttribute("height", imReHeight);
				//image.setAttribute("style", "left:0px; top:"+String(Math.round((frameHeight-imReHeight)/2)+topHeight)+"px;");
				image.style.left = "0px";
				image.style.top = String(Math.round((frameHeight-imReHeight)/2)+topHeight)+"px";
				image.style.marginLeft = "0px";
			}
		} else {
			if (imRatio < frameRatio) {
				imReWidth = Math.round(frameHeight*imWidth/imHeight);
				imReHeight = frameHeight;		
				image.setAttribute("width",imReWidth);
				image.setAttribute("height",imReHeight);
				//image.setAttribute("style", "left:50%; top:"+topHeight+"px; margin-left:-"+String(Math.round(imReWidth/2))+"px;");
				image.style.left = "50%";
				image.style.top = String(topHeight)+"px";
				image.style.marginLeft = String(-Math.round(imReWidth/2))+"px";
			} else {
				imReWidth = frameWidth;
				imReHeight = Math.round(frameWidth*imHeight/imWidth);
				image.setAttribute("width", imReWidth);
				image.setAttribute("height", imReHeight);
				//image.setAttribute("style", "left:0px; top:"+String(Math.round((frameHeight-imReHeight)/2)+topHeight)+"px;");
				image.style.left = "0px";
				image.style.top = String(Math.round((frameHeight-imReHeight)/2)+topHeight)+"px";
				image.style.marginLeft = "0px";
			}
		}
	}
}


function loadTrans(q) {
	xmlHttp = GetXmlHttpObject();
	if (xmlHttp == null) {
		alert ("Browser does not support HTTP Request");
		return;
	}
	
	var url = "text/"+q+".txt";
	xmlHttp.onreadystatechange = afterLoadTrans;
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);	
}

// processing file data
function afterLoadTrans() {
	if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        if (xmlHttp.status == 200 || xmlHttp.status == 0) {
			transPanel.innerHTML = "<div style='padding:15px;'>"+xmlHttp.responseText+"</div>";
        } else {
            console.log("There was a problem retrieving the transcript data:\n" + xmlHttp.statusText);
			transPanel.innerHTML = "<div style='padding:15px;'></div>";
        }
    }
}



