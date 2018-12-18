/**
 * Created by quyengeek on 12/04/2017.
 */


//error text

//client request errors

///////Animation Vars////////

//claw vars
var clawTweenTime = 1;//how long it takes to open the claws after they snap shut
var rightClawRepeatDelay = 1;//time between claw snaps
var leftClawRepeatDelay = 1.7;//time between claw snaps

//body vars
var bodySwayTime = 1;//how long it takes to sway left or right
var bodySwayAmount = 5;//how much it sways (in degrees)

//eye vars
var blinkRepeatTime = 2.2;//time between each blink
var eyesMoveRepeatTime = .9;//how often the eyes move



///////////////No need to edit beyond this point/////////////////

var bodyTO = "50px 92px";
var eyesY = -2;

window.addEventListener('load', function () {
	iniBrokebot();
}, false);

//page loaded
function iniBrokebot()
{

	if(!isHeadless){
		eyesY = 0;
		bodyTO = "43px 160px"
	}

	//set the error code

	animateBrokebot();

}


//run each of the animations
function animateBrokebot()
{

	var f = Snap('#brokebotSVG');

	var rightInnerClaw = f.select('#rightInnerClaw');
	var rightOuterClaw = f.select('#rightOuterClaw');
	var leftInnerClaw = f.select('#leftInnerClaw');
	var leftOuterClaw = f.select('#leftOuterClaw');
	var upperBody = f.select('#upperBody');
	var eyesMove = f.select('#eyesMove');
	var eyesBlink = f.select('#eyesBlink');
	var leftArm = f.select('#leftArm');
	var rightLowerArm = f.select('#rightLowerArm');
	var robotHead = f.select('#robotHead');
	var errorCodeTxt = f.select('#errorCodeTxt');



	 //animate claws
 	setTimeout(function () {
		TweenMax.from(rightInnerClaw.node, clawTweenTime, {
		  rotation:45,
		  transformOrigin:"11px 15px",
		  repeat:-1,
		  repeatDelay:rightClawRepeatDelay
		});

		TweenMax.from(rightOuterClaw.node, clawTweenTime, {
		  rotation:-45,
		  transformOrigin:"15px 15px",
		  repeat:-1,
		  repeatDelay:rightClawRepeatDelay
		});
	}, rightClawRepeatDelay*1000);

	setTimeout(function () {
		TweenMax.from(leftInnerClaw.node, clawTweenTime, {
		  rotation:-45,
		  transformOrigin:"15px 15px",
		  repeat:-1,
		  repeatDelay:leftClawRepeatDelay
		});

		TweenMax.from(leftOuterClaw.node, clawTweenTime, {
		  rotation:45,
		  transformOrigin:"11px 15px",
		  repeat:-1,
		  repeatDelay:leftClawRepeatDelay
		});
	}, leftClawRepeatDelay*1000);



	//upperBody.animate({rotation: 50}, 1000);
	//var upperBody = document.getElementById('upperBody');
// 	//animate the error code in
 	TweenMax.from(errorCodeTxt.node, 2, {opacity:0});




// 	//animate swaying body and arms
 	TweenMax.to(upperBody.node, bodySwayTime, {
 		rotationZ:-bodySwayAmount, transformOrigin:bodyTO, yoyo:true, repeat:-1, ease:Quad.easeInOut
 	});
 	TweenMax.to(leftArm.node, bodySwayTime, {
 		delay:.3, rotationZ:bodySwayAmount, transformOrigin:"15px -11px", yoyo:true, repeat:-1, ease:Quad.easeInOut
 	});
 	TweenMax.to(rightLowerArm.node, bodySwayTime, {
 		delay:.5, rotationZ:bodySwayAmount, transformOrigin:"15px 0px", yoyo:true, repeat:-1, ease:Quad.easeInOut
 	});

 	//animate blinking and eye movement
	TweenMax.to(eyesMove.node, .05, {
		delay:eyesMoveRepeatTime, x:-2, y:eyesY, repeatDelay:eyesMoveRepeatTime, repeat:-1, yoyo:true
	});

 	TweenMax.from(eyesBlink.node, .3, {
 		scaleY:.2, repeatDelay:blinkRepeatTime, repeat:-1, transformOrigin:"0px 6px"
 	});

 	if(!isHeadless){
 		TweenMax.from(robotHead.node, bodySwayTime, {
 			delay:bodySwayTime, rotationZ:bodySwayAmount*1.5, transformOrigin:"65px 77px", yoyo:true, repeat:-1, ease:Quad.easeInOut
 		});
 	}

}

//get the error code from the URL
function GetUrlValue(VarSearch){

    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');

        if(KeyValuePair[0] == VarSearch){
            return KeyValuePair[1];
        }
    }
}

function searchClicked(myForm)
{
	var searchTxt = document.getElementById('robot-search-input').value;
	var searchEncoded = encodeURIComponent(searchTxt);
	if(searchEncoded != "")
		window.location.href = "http://codecanyon.net/search?term=" + searchEncoded + "&ref=dxc";

	return false;
}
