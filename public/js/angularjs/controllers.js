(function(d){"function"===typeof define&&define.amd?define(["jquery"],d):d(jQuery)})(function(d){function g(a,b){var c=function(){},c={autoSelectFirst:!1,appendTo:"body",serviceUrl:null,lookup:null,onSelect:null,width:"auto",minChars:1,maxHeight:300,deferRequestBy:0,params:{},formatResult:g.formatResult,delimiter:null,zIndex:9999,type:"GET",noCache:!1,onSearchStart:c,onSearchComplete:c,onSearchError:c,containerClass:"autocomplete-suggestions",tabDisabled:!1,dataType:"text",currentRequest:null,triggerSelectOnValidInput:!0,
lookupFilter:function(a,b,c){return-1!==a.value.toLowerCase().indexOf(c)},paramName:"query",transformResult:function(a){return"string"===typeof a?d.parseJSON(a):a}};this.element=a;this.el=d(a);this.suggestions=[];this.badQueries=[];this.selectedIndex=-1;this.currentValue=this.element.value;this.intervalId=0;this.cachedResponse={};this.onChange=this.onChangeInterval=null;this.isLocal=!1;this.suggestionsContainer=null;this.options=d.extend({},c,b);this.classes={selected:"autocomplete-selected",suggestion:"autocomplete-suggestion"};
this.hint=null;this.hintValue="";this.selection=null;this.initialize();this.setOptions(b)}var k=function(){return{escapeRegExChars:function(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},createNode:function(a){var b=document.createElement("div");b.className=a;b.style.position="absolute";b.style.display="none";return b}}}();g.utils=k;d.Autocomplete=g;g.formatResult=function(a,b){var c="("+k.escapeRegExChars(b)+")";return a.value.replace(RegExp(c,"gi"),"<strong>$1</strong>")};g.prototype=
{killerFn:null,initialize:function(){var a=this,b="."+a.classes.suggestion,c=a.classes.selected,e=a.options,f;a.element.setAttribute("autocomplete","off");a.killerFn=function(b){0===d(b.target).closest("."+a.options.containerClass).length&&(a.killSuggestions(),a.disableKillerFn())};a.suggestionsContainer=g.utils.createNode(e.containerClass);f=d(a.suggestionsContainer);f.appendTo(e.appendTo);"auto"!==e.width&&f.width(e.width);f.on("mouseover.autocomplete",b,function(){a.activate(d(this).data("index"))});
f.on("mouseout.autocomplete",function(){a.selectedIndex=-1;f.children("."+c).removeClass(c)});f.on("click.autocomplete",b,function(){a.select(d(this).data("index"))});a.fixPosition();a.fixPositionCapture=function(){a.visible&&a.fixPosition()};d(window).on("resize.autocomplete",a.fixPositionCapture);a.el.on("keydown.autocomplete",function(b){a.onKeyPress(b)});a.el.on("keyup.autocomplete",function(b){a.onKeyUp(b)});a.el.on("blur.autocomplete",function(){a.onBlur()});a.el.on("focus.autocomplete",function(){a.onFocus()});
a.el.on("change.autocomplete",function(b){a.onKeyUp(b)})},onFocus:function(){this.fixPosition();if(this.options.minChars<=this.el.val().length)this.onValueChange()},onBlur:function(){this.enableKillerFn()},setOptions:function(a){var b=this.options;d.extend(b,a);if(this.isLocal=d.isArray(b.lookup))b.lookup=this.verifySuggestionsFormat(b.lookup);d(this.suggestionsContainer).css({"max-height":b.maxHeight+"px",width:b.width+"px","z-index":b.zIndex})},clearCache:function(){this.cachedResponse={};this.badQueries=
[]},clear:function(){this.clearCache();this.currentValue="";this.suggestions=[]},disable:function(){this.disabled=!0;this.currentRequest&&this.currentRequest.abort()},enable:function(){this.disabled=!1},fixPosition:function(){var a;"body"===this.options.appendTo&&(a=this.el.offset(),a={top:a.top+this.el.outerHeight()+"px",left:a.left+"px"},"auto"===this.options.width&&(a.width=this.el.outerWidth()-2+"px"),d(this.suggestionsContainer).css(a))},enableKillerFn:function(){d(document).on("click.autocomplete",
this.killerFn)},disableKillerFn:function(){d(document).off("click.autocomplete",this.killerFn)},killSuggestions:function(){var a=this;a.stopKillSuggestions();a.intervalId=window.setInterval(function(){a.hide();a.stopKillSuggestions()},50)},stopKillSuggestions:function(){window.clearInterval(this.intervalId)},isCursorAtEnd:function(){var a=this.el.val().length,b=this.element.selectionStart;return"number"===typeof b?b===a:document.selection?(b=document.selection.createRange(),b.moveStart("character",
-a),a===b.text.length):!0},onKeyPress:function(a){if(!this.disabled&&!this.visible&&40===a.which&&this.currentValue)this.suggest();else if(!this.disabled&&this.visible){switch(a.which){case 27:this.el.val(this.currentValue);this.hide();break;case 39:if(this.hint&&this.options.onHint&&this.isCursorAtEnd()){this.selectHint();break}return;case 9:if(this.hint&&this.options.onHint){this.selectHint();return}case 13:if(-1===this.selectedIndex){this.hide();return}this.select(this.selectedIndex);if(9===a.which&&
!1===this.options.tabDisabled)return;break;case 38:this.moveUp();break;case 40:this.moveDown();break;default:return}a.stopImmediatePropagation();a.preventDefault()}},onKeyUp:function(a){var b=this;if(!b.disabled){switch(a.which){case 38:case 40:return}clearInterval(b.onChangeInterval);if(b.currentValue!==b.el.val())if(b.findBestHint(),0<b.options.deferRequestBy)b.onChangeInterval=setInterval(function(){b.onValueChange()},b.options.deferRequestBy);else b.onValueChange()}},onValueChange:function(){var a=
this.options,b=this.el.val(),c=this.getQuery(b);this.selection&&(this.selection=null,(a.onInvalidateSelection||d.noop).call(this.element));clearInterval(this.onChangeInterval);this.currentValue=b;this.selectedIndex=-1;if(a.triggerSelectOnValidInput&&(b=this.findSuggestionIndex(c),-1!==b)){this.select(b);return}c.length<a.minChars?this.hide():this.getSuggestions(c)},findSuggestionIndex:function(a){var b=-1,c=a.toLowerCase();d.each(this.suggestions,function(a,d){if(d.value.toLowerCase()===c)return b=
a,!1});return b},getQuery:function(a){var b=this.options.delimiter;if(!b)return a;a=a.split(b);return d.trim(a[a.length-1])},getSuggestionsLocal:function(a){var b=this.options,c=a.toLowerCase(),e=b.lookupFilter,f=parseInt(b.lookupLimit,10),b={suggestions:d.grep(b.lookup,function(b){return e(b,a,c)})};f&&b.suggestions.length>f&&(b.suggestions=b.suggestions.slice(0,f));return b},getSuggestions:function(a){var b,c=this,e=c.options,f=e.serviceUrl,l,g;e.params[e.paramName]=a;l=e.ignoreParams?null:e.params;
c.isLocal?b=c.getSuggestionsLocal(a):(d.isFunction(f)&&(f=f.call(c.element,a)),g=f+"?"+d.param(l||{}),b=c.cachedResponse[g]);b&&d.isArray(b.suggestions)?(c.suggestions=b.suggestions,c.suggest()):c.isBadQuery(a)||!1===e.onSearchStart.call(c.element,e.params)||(c.currentRequest&&c.currentRequest.abort(),c.currentRequest=d.ajax({url:f,data:l,type:e.type,dataType:e.dataType}).done(function(b){c.currentRequest=null;c.processResponse(b,a,g);e.onSearchComplete.call(c.element,a)}).fail(function(b,d,f){e.onSearchError.call(c.element,
a,b,d,f)}))},isBadQuery:function(a){for(var b=this.badQueries,c=b.length;c--;)if(0===a.indexOf(b[c]))return!0;return!1},hide:function(){this.visible=!1;this.selectedIndex=-1;d(this.suggestionsContainer).hide();this.signalHint(null)},suggest:function(){if(0===this.suggestions.length)this.hide();else{var a=this.options,b=a.formatResult,c=this.getQuery(this.currentValue),e=this.classes.suggestion,f=this.classes.selected,g=d(this.suggestionsContainer),k=a.beforeRender,m="",h;if(a.triggerSelectOnValidInput&&
(h=this.findSuggestionIndex(c),-1!==h)){this.select(h);return}d.each(this.suggestions,function(a,d){m+='<div class="'+e+'" data-index="'+a+'">'+b(d,c)+"</div>"});"auto"===a.width&&(h=this.el.outerWidth()-2,g.width(0<h?h:300));g.html(m);a.autoSelectFirst&&(this.selectedIndex=0,g.children().first().addClass(f));d.isFunction(k)&&k.call(this.element,g);g.show();this.visible=!0;this.findBestHint()}},findBestHint:function(){var a=this.el.val().toLowerCase(),b=null;a&&(d.each(this.suggestions,function(c,
d){var f=0===d.value.toLowerCase().indexOf(a);f&&(b=d);return!f}),this.signalHint(b))},signalHint:function(a){var b="";a&&(b=this.currentValue+a.value.substr(this.currentValue.length));this.hintValue!==b&&(this.hintValue=b,this.hint=a,(this.options.onHint||d.noop)(b))},verifySuggestionsFormat:function(a){return a.length&&"string"===typeof a[0]?d.map(a,function(a){return{value:a,data:null}}):a},processResponse:function(a,b,c){var d=this.options;a=d.transformResult(a,b);a.suggestions=this.verifySuggestionsFormat(a.suggestions);
d.noCache||(this.cachedResponse[c]=a,0===a.suggestions.length&&this.badQueries.push(c));b===this.getQuery(this.currentValue)&&(this.suggestions=a.suggestions,this.suggest())},activate:function(a){var b=this.classes.selected,c=d(this.suggestionsContainer),e=c.children();c.children("."+b).removeClass(b);this.selectedIndex=a;return-1!==this.selectedIndex&&e.length>this.selectedIndex?(a=e.get(this.selectedIndex),d(a).addClass(b),a):null},selectHint:function(){var a=d.inArray(this.hint,this.suggestions);
this.select(a)},select:function(a){this.hide();this.onSelect(a)},moveUp:function(){-1!==this.selectedIndex&&(0===this.selectedIndex?(d(this.suggestionsContainer).children().first().removeClass(this.classes.selected),this.selectedIndex=-1,this.el.val(this.currentValue),this.findBestHint()):this.adjustScroll(this.selectedIndex-1))},moveDown:function(){this.selectedIndex!==this.suggestions.length-1&&this.adjustScroll(this.selectedIndex+1)},adjustScroll:function(a){var b=this.activate(a),c,e;b&&(b=b.offsetTop,
c=d(this.suggestionsContainer).scrollTop(),e=c+this.options.maxHeight-25,b<c?d(this.suggestionsContainer).scrollTop(b):b>e&&d(this.suggestionsContainer).scrollTop(b-this.options.maxHeight+25),this.el.val(this.getValue(this.suggestions[a].value)),this.signalHint(null))},onSelect:function(a){var b=this.options.onSelect;a=this.suggestions[a];this.currentValue=this.getValue(a.value);this.el.val(this.currentValue);this.signalHint(null);this.suggestions=[];this.selection=a;d.isFunction(b)&&b.call(this.element,
a)},getValue:function(a){var b=this.options.delimiter,c;if(!b)return a;c=this.currentValue;b=c.split(b);return 1===b.length?a:c.substr(0,c.length-b[b.length-1].length)+a},dispose:function(){this.el.off(".autocomplete").removeData("autocomplete");this.disableKillerFn();d(window).off("resize.autocomplete",this.fixPositionCapture);d(this.suggestionsContainer).remove()}};d.fn.autocomplete=function(a,b){return 0===arguments.length?this.first().data("autocomplete"):this.each(function(){var c=d(this),e=
c.data("autocomplete");if("string"===typeof a){if(e&&"function"===typeof e[a])e[a](b)}else e&&e.dispose&&e.dispose(),e=new g(this,a),c.data("autocomplete",e)})}});

/* Tooltipster v3.2.6 */;(function(e,t,n){function s(t,n){this.bodyOverflowX;this.callbacks={hide:[],show:[]};this.checkInterval=null;this.Content;this.$el=e(t);this.$elProxy;this.elProxyPosition;this.enabled=true;this.options=e.extend({},i,n);this.mouseIsOverProxy=false;this.namespace="tooltipster-"+Math.round(Math.random()*1e5);this.Status="hidden";this.timerHide=null;this.timerShow=null;this.$tooltip;this.options.iconTheme=this.options.iconTheme.replace(".","");this.options.theme=this.options.theme.replace(".","");this._init()}function o(t,n){var r=true;e.each(t,function(e,i){if(typeof n[e]==="undefined"||t[e]!==n[e]){r=false;return false}});return r}function f(){return!a&&u}function l(){var e=n.body||n.documentElement,t=e.style,r="transition";if(typeof t[r]=="string"){return true}v=["Moz","Webkit","Khtml","O","ms"],r=r.charAt(0).toUpperCase()+r.substr(1);for(var i=0;i<v.length;i++){if(typeof t[v[i]+r]=="string"){return true}}return false}var r="tooltipster",i={animation:"fade",arrow:true,arrowColor:"",autoClose:true,content:null,contentAsHTML:false,contentCloning:true,debug:true,delay:200,minWidth:0,maxWidth:null,functionInit:function(e,t){},functionBefore:function(e,t){t()},functionReady:function(e,t){},functionAfter:function(e){},icon:"(?)",iconCloning:true,iconDesktop:false,iconTouch:false,iconTheme:"tooltipster-icon",interactive:false,interactiveTolerance:350,multiple:false,offsetX:0,offsetY:0,onlyOne:false,position:"top",positionTracker:false,speed:350,timer:0,theme:"tooltipster-default",touchDevices:true,trigger:"hover",updateAnimation:true};s.prototype={_init:function(){var t=this;if(n.querySelector){if(t.options.content!==null){t._content_set(t.options.content)}else{var r=t.$el.attr("title");if(typeof r==="undefined")r=null;t._content_set(r)}var i=t.options.functionInit.call(t.$el,t.$el,t.Content);if(typeof i!=="undefined")t._content_set(i);t.$el.removeAttr("title").addClass("tooltipstered");if(!u&&t.options.iconDesktop||u&&t.options.iconTouch){if(typeof t.options.icon==="string"){t.$elProxy=e('<span class="'+t.options.iconTheme+'"></span>');t.$elProxy.text(t.options.icon)}else{if(t.options.iconCloning)t.$elProxy=t.options.icon.clone(true);else t.$elProxy=t.options.icon}t.$elProxy.insertAfter(t.$el)}else{t.$elProxy=t.$el}if(t.options.trigger=="hover"){t.$elProxy.on("mouseenter."+t.namespace,function(){if(!f()||t.options.touchDevices){t.mouseIsOverProxy=true;t._show()}}).on("mouseleave."+t.namespace,function(){if(!f()||t.options.touchDevices){t.mouseIsOverProxy=false}});if(u&&t.options.touchDevices){t.$elProxy.on("touchstart."+t.namespace,function(){t._showNow()})}}else if(t.options.trigger=="click"){t.$elProxy.on("click."+t.namespace,function(){if(!f()||t.options.touchDevices){t._show()}})}}},_show:function(){var e=this;if(e.Status!="shown"&&e.Status!="appearing"){if(e.options.delay){e.timerShow=setTimeout(function(){if(e.options.trigger=="click"||e.options.trigger=="hover"&&e.mouseIsOverProxy){e._showNow()}},e.options.delay)}else e._showNow()}},_showNow:function(n){var r=this;r.options.functionBefore.call(r.$el,r.$el,function(){if(r.enabled&&r.Content!==null){if(n)r.callbacks.show.push(n);r.callbacks.hide=[];clearTimeout(r.timerShow);r.timerShow=null;clearTimeout(r.timerHide);r.timerHide=null;if(r.options.onlyOne){e(".tooltipstered").not(r.$el).each(function(t,n){var r=e(n),i=r.data("tooltipster-ns");e.each(i,function(e,t){var n=r.data(t),i=n.status(),s=n.option("autoClose");if(i!=="hidden"&&i!=="disappearing"&&s){n.hide()}})})}var i=function(){r.Status="shown";e.each(r.callbacks.show,function(e,t){t.call(r.$el)});r.callbacks.show=[]};if(r.Status!=="hidden"){var s=0;if(r.Status==="disappearing"){r.Status="appearing";if(l()){r.$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-"+r.options.animation+"-show");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(i)}else{r.$tooltip.stop().fadeIn(i)}}else if(r.Status==="shown"){i()}}else{r.Status="appearing";var s=r.options.speed;r.bodyOverflowX=e("body").css("overflow-x");e("body").css("overflow-x","hidden");var o="tooltipster-"+r.options.animation,a="-webkit-transition-duration: "+r.options.speed+"ms; -webkit-animation-duration: "+r.options.speed+"ms; -moz-transition-duration: "+r.options.speed+"ms; -moz-animation-duration: "+r.options.speed+"ms; -o-transition-duration: "+r.options.speed+"ms; -o-animation-duration: "+r.options.speed+"ms; -ms-transition-duration: "+r.options.speed+"ms; -ms-animation-duration: "+r.options.speed+"ms; transition-duration: "+r.options.speed+"ms; animation-duration: "+r.options.speed+"ms;",f=r.options.minWidth?"min-width:"+Math.round(r.options.minWidth)+"px;":"",c=r.options.maxWidth?"max-width:"+Math.round(r.options.maxWidth)+"px;":"",h=r.options.interactive?"pointer-events: auto;":"";r.$tooltip=e('<div class="tooltipster-base '+r.options.theme+'" style="'+f+" "+c+" "+h+" "+a+'"><div class="tooltipster-content"></div></div>');if(l())r.$tooltip.addClass(o);r._content_insert();r.$tooltip.appendTo("body");r.reposition();r.options.functionReady.call(r.$el,r.$el,r.$tooltip);if(l()){r.$tooltip.addClass(o+"-show");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(i)}else{r.$tooltip.css("display","none").fadeIn(r.options.speed,i)}r._interval_set();e(t).on("scroll."+r.namespace+" resize."+r.namespace,function(){r.reposition()});if(r.options.autoClose){e("body").off("."+r.namespace);if(r.options.trigger=="hover"){if(u){setTimeout(function(){e("body").on("touchstart."+r.namespace,function(){r.hide()})},0)}if(r.options.interactive){if(u){r.$tooltip.on("touchstart."+r.namespace,function(e){e.stopPropagation()})}var p=null;r.$elProxy.add(r.$tooltip).on("mouseleave."+r.namespace+"-autoClose",function(){clearTimeout(p);p=setTimeout(function(){r.hide()},r.options.interactiveTolerance)}).on("mouseenter."+r.namespace+"-autoClose",function(){clearTimeout(p)})}else{r.$elProxy.on("mouseleave."+r.namespace+"-autoClose",function(){r.hide()})}}else if(r.options.trigger=="click"){setTimeout(function(){e("body").on("click."+r.namespace+" touchstart."+r.namespace,function(){r.hide()})},0);if(r.options.interactive){r.$tooltip.on("click."+r.namespace+" touchstart."+r.namespace,function(e){e.stopPropagation()})}}}}if(r.options.timer>0){r.timerHide=setTimeout(function(){r.timerHide=null;r.hide()},r.options.timer+s)}}})},_interval_set:function(){var t=this;t.checkInterval=setInterval(function(){if(e("body").find(t.$el).length===0||e("body").find(t.$elProxy).length===0||t.Status=="hidden"||e("body").find(t.$tooltip).length===0){if(t.Status=="shown"||t.Status=="appearing")t.hide();t._interval_cancel()}else{if(t.options.positionTracker){var n=t._repositionInfo(t.$elProxy),r=false;if(o(n.dimension,t.elProxyPosition.dimension)){if(t.$elProxy.css("position")==="fixed"){if(o(n.position,t.elProxyPosition.position))r=true}else{if(o(n.offset,t.elProxyPosition.offset))r=true}}if(!r){t.reposition()}}}},200)},_interval_cancel:function(){clearInterval(this.checkInterval);this.checkInterval=null},_content_set:function(e){if(typeof e==="object"&&e!==null&&this.options.contentCloning){e=e.clone(true)}this.Content=e},_content_insert:function(){var e=this,t=this.$tooltip.find(".tooltipster-content");if(typeof e.Content==="string"&&!e.options.contentAsHTML){t.text(e.Content)}else{t.empty().append(e.Content)}},_update:function(e){var t=this;t._content_set(e);if(t.Content!==null){if(t.Status!=="hidden"){t._content_insert();t.reposition();if(t.options.updateAnimation){if(l()){t.$tooltip.css({width:"","-webkit-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-moz-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-o-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-ms-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms",transition:"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms"}).addClass("tooltipster-content-changing");setTimeout(function(){if(t.Status!="hidden"){t.$tooltip.removeClass("tooltipster-content-changing");setTimeout(function(){if(t.Status!=="hidden"){t.$tooltip.css({"-webkit-transition":t.options.speed+"ms","-moz-transition":t.options.speed+"ms","-o-transition":t.options.speed+"ms","-ms-transition":t.options.speed+"ms",transition:t.options.speed+"ms"})}},t.options.speed)}},t.options.speed)}else{t.$tooltip.fadeTo(t.options.speed,.5,function(){if(t.Status!="hidden"){t.$tooltip.fadeTo(t.options.speed,1)}})}}}}else{t.hide()}},_repositionInfo:function(e){return{dimension:{height:e.outerHeight(false),width:e.outerWidth(false)},offset:e.offset(),position:{left:parseInt(e.css("left")),top:parseInt(e.css("top"))}}},hide:function(n){var r=this;if(n)r.callbacks.hide.push(n);r.callbacks.show=[];clearTimeout(r.timerShow);r.timerShow=null;clearTimeout(r.timerHide);r.timerHide=null;var i=function(){e.each(r.callbacks.hide,function(e,t){t.call(r.$el)});r.callbacks.hide=[]};if(r.Status=="shown"||r.Status=="appearing"){r.Status="disappearing";var s=function(){r.Status="hidden";if(typeof r.Content=="object"&&r.Content!==null){r.Content.detach()}r.$tooltip.remove();r.$tooltip=null;e(t).off("."+r.namespace);e("body").off("."+r.namespace).css("overflow-x",r.bodyOverflowX);e("body").off("."+r.namespace);r.$elProxy.off("."+r.namespace+"-autoClose");r.options.functionAfter.call(r.$el,r.$el);i()};if(l()){r.$tooltip.clearQueue().removeClass("tooltipster-"+r.options.animation+"-show").addClass("tooltipster-dying");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(s)}else{r.$tooltip.stop().fadeOut(r.options.speed,s)}}else if(r.Status=="hidden"){i()}return r},show:function(e){this._showNow(e);return this},update:function(e){return this.content(e)},content:function(e){if(typeof e==="undefined"){return this.Content}else{this._update(e);return this}},reposition:function(){var n=this;if(e("body").find(n.$tooltip).length!==0){n.$tooltip.css("width","");n.elProxyPosition=n._repositionInfo(n.$elProxy);var r=null,i=e(t).width(),s=n.elProxyPosition,o=n.$tooltip.outerWidth(false),u=n.$tooltip.innerWidth()+1,a=n.$tooltip.outerHeight(false);if(n.$elProxy.is("area")){var f=n.$elProxy.attr("shape"),l=n.$elProxy.parent().attr("name"),c=e('img[usemap="#'+l+'"]'),h=c.offset().left,p=c.offset().top,d=n.$elProxy.attr("coords")!==undefined?n.$elProxy.attr("coords").split(","):undefined;if(f=="circle"){var v=parseInt(d[0]),m=parseInt(d[1]),g=parseInt(d[2]);s.dimension.height=g*2;s.dimension.width=g*2;s.offset.top=p+m-g;s.offset.left=h+v-g}else if(f=="rect"){var v=parseInt(d[0]),m=parseInt(d[1]),y=parseInt(d[2]),b=parseInt(d[3]);s.dimension.height=b-m;s.dimension.width=y-v;s.offset.top=p+m;s.offset.left=h+v}else if(f=="poly"){var w=[],E=[],S=0,x=0,T=0,N=0,C="even";for(var k=0;k<d.length;k++){var L=parseInt(d[k]);if(C=="even"){if(L>T){T=L;if(k===0){S=T}}if(L<S){S=L}C="odd"}else{if(L>N){N=L;if(k==1){x=N}}if(L<x){x=L}C="even"}}s.dimension.height=N-x;s.dimension.width=T-S;s.offset.top=p+x;s.offset.left=h+S}else{s.dimension.height=c.outerHeight(false);s.dimension.width=c.outerWidth(false);s.offset.top=p;s.offset.left=h}}var A=0,O=0,M=0,_=parseInt(n.options.offsetY),D=parseInt(n.options.offsetX),P=n.options.position;function H(){var n=e(t).scrollLeft();if(A-n<0){r=A-n;A=n}if(A+o-n>i){r=A-(i+n-o);A=i+n-o}}function B(n,r){if(s.offset.top-e(t).scrollTop()-a-_-12<0&&r.indexOf("top")>-1){P=n}if(s.offset.top+s.dimension.height+a+12+_>e(t).scrollTop()+e(t).height()&&r.indexOf("bottom")>-1){P=n;M=s.offset.top-a-_-12}}if(P=="top"){var j=s.offset.left+o-(s.offset.left+s.dimension.width);A=s.offset.left+D-j/2;M=s.offset.top-a-_-12;H();B("bottom","top")}if(P=="top-left"){A=s.offset.left+D;M=s.offset.top-a-_-12;H();B("bottom-left","top-left")}if(P=="top-right"){A=s.offset.left+s.dimension.width+D-o;M=s.offset.top-a-_-12;H();B("bottom-right","top-right")}if(P=="bottom"){var j=s.offset.left+o-(s.offset.left+s.dimension.width);A=s.offset.left-j/2+D;M=s.offset.top+s.dimension.height+_+12;H();B("top","bottom")}if(P=="bottom-left"){A=s.offset.left+D;M=s.offset.top+s.dimension.height+_+12;H();B("top-left","bottom-left")}if(P=="bottom-right"){A=s.offset.left+s.dimension.width+D-o;M=s.offset.top+s.dimension.height+_+12;H();B("top-right","bottom-right")}if(P=="left"){A=s.offset.left-D-o-12;O=s.offset.left+D+s.dimension.width+12;var F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_;if(A<0&&O+o>i){var I=parseFloat(n.$tooltip.css("border-width"))*2,q=o+A-I;n.$tooltip.css("width",q+"px");a=n.$tooltip.outerHeight(false);A=s.offset.left-D-q-12-I;F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_}else if(A<0){A=s.offset.left+D+s.dimension.width+12;r="left"}}if(P=="right"){A=s.offset.left+D+s.dimension.width+12;O=s.offset.left-D-o-12;var F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_;if(A+o>i&&O<0){var I=parseFloat(n.$tooltip.css("border-width"))*2,q=i-A-I;n.$tooltip.css("width",q+"px");a=n.$tooltip.outerHeight(false);F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_}else if(A+o>i){A=s.offset.left-D-o-12;r="right"}}if(n.options.arrow){var R="tooltipster-arrow-"+P;if(n.options.arrowColor.length<1){var U=n.$tooltip.css("background-color")}else{var U=n.options.arrowColor}if(!r){r=""}else if(r=="left"){R="tooltipster-arrow-right";r=""}else if(r=="right"){R="tooltipster-arrow-left";r=""}else{r="left:"+Math.round(r)+"px;"}if(P=="top"||P=="top-left"||P=="top-right"){var z=parseFloat(n.$tooltip.css("border-bottom-width")),W=n.$tooltip.css("border-bottom-color")}else if(P=="bottom"||P=="bottom-left"||P=="bottom-right"){var z=parseFloat(n.$tooltip.css("border-top-width")),W=n.$tooltip.css("border-top-color")}else if(P=="left"){var z=parseFloat(n.$tooltip.css("border-right-width")),W=n.$tooltip.css("border-right-color")}else if(P=="right"){var z=parseFloat(n.$tooltip.css("border-left-width")),W=n.$tooltip.css("border-left-color")}else{var z=parseFloat(n.$tooltip.css("border-bottom-width")),W=n.$tooltip.css("border-bottom-color")}if(z>1){z++}var X="";if(z!==0){var V="",J="border-color: "+W+";";if(R.indexOf("bottom")!==-1){V="margin-top: -"+Math.round(z)+"px;"}else if(R.indexOf("top")!==-1){V="margin-bottom: -"+Math.round(z)+"px;"}else if(R.indexOf("left")!==-1){V="margin-right: -"+Math.round(z)+"px;"}else if(R.indexOf("right")!==-1){V="margin-left: -"+Math.round(z)+"px;"}X='<span class="tooltipster-arrow-border" style="'+V+" "+J+';"></span>'}n.$tooltip.find(".tooltipster-arrow").remove();var K='<div class="'+R+' tooltipster-arrow" style="'+r+'">'+X+'<span style="border-color:'+U+';"></span></div>';n.$tooltip.append(K)}n.$tooltip.css({top:Math.round(M)+"px",left:Math.round(A)+"px"})}return n},enable:function(){this.enabled=true;return this},disable:function(){this.hide();this.enabled=false;return this},destroy:function(){var t=this;t.hide();if(t.$el[0]!==t.$elProxy[0])t.$elProxy.remove();t.$el.removeData(t.namespace).off("."+t.namespace);var n=t.$el.data("tooltipster-ns");if(n.length===1){var r=typeof t.Content==="string"?t.Content:e("<div></div>").append(t.Content).html();t.$el.removeClass("tooltipstered").attr("title",r).removeData(t.namespace).removeData("tooltipster-ns").off("."+t.namespace)}else{n=e.grep(n,function(e,n){return e!==t.namespace});t.$el.data("tooltipster-ns",n)}return t},elementIcon:function(){return this.$el[0]!==this.$elProxy[0]?this.$elProxy[0]:undefined},elementTooltip:function(){return this.$tooltip?this.$tooltip[0]:undefined},option:function(e,t){if(typeof t=="undefined")return this.options[e];else{this.options[e]=t;return this}},status:function(){return this.Status}};e.fn[r]=function(){var t=arguments;if(this.length===0){if(typeof t[0]==="string"){var n=true;switch(t[0]){case"setDefaults":e.extend(i,t[1]);break;default:n=false;break}if(n)return true;else return this}else{return this}}else{if(typeof t[0]==="string"){var r="#*$~&";this.each(function(){var n=e(this).data("tooltipster-ns"),i=n?e(this).data(n[0]):null;if(i){if(typeof i[t[0]]==="function"){var s=i[t[0]](t[1],t[2])}else{throw new Error('Unknown method .tooltipster("'+t[0]+'")')}if(s!==i){r=s;return false}}else{throw new Error("You called Tooltipster's \""+t[0]+'" method on an uninitialized element')}});return r!=="#*$~&"?r:this}else{var o=[],u=t[0]&&typeof t[0].multiple!=="undefined",a=u&&t[0].multiple||!u&&i.multiple,f=t[0]&&typeof t[0].debug!=="undefined",l=f&&t[0].debug||!f&&i.debug;this.each(function(){var n=false,r=e(this).data("tooltipster-ns"),i=null;if(!r){n=true}else if(a){n=true}else if(l){console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.')}if(n){i=new s(this,t[0]);if(!r)r=[];r.push(i.namespace);e(this).data("tooltipster-ns",r);e(this).data(i.namespace,i)}o.push(i)});if(a)return o;else return this}}};var u=!!("ontouchstart"in t);var a=false;e("body").one("mousemove",function(){a=true})})(jQuery,window,document);

function _x(x) {
    return x * 561 / 100;
}
function _y(y) {
    return 561 - y * 561 / 100;
}

function show_popover() {
    $("#perons-position").popover('show');
}
function show_analysis_modal() {
    $('#perons-position').popover('hide');
    $('#individual-grid').modal();
}

function score_to_percent(score) {
    try{
        if (score == null) {
            return 0;
        }

        return score.toFixed(1);
    }catch(err){
        console.log(err.message);
        return 0;
    }

}
function score_to_percent_old(score) {
    try{
        if (score == null) {
            return 0;
        }

        percent_100 = 2.0 / 3 * 100;
        if (score <= percent_100) {
            return (score * 100 / (2.0 / 3 * 100)).toFixed(1);
        } else {
            return (100 + (score - percent_100) * 20 / (1.0 / 3 * 100)).toFixed(1);
        }
    }catch(err){
        console.log(err.message);
        return 0;
    }

}

function delete__kpi_score_calculator(operator, target, real) {
    if (operator == ">=") {
        if (target == 0) {
            if (target == real) {
                score = 2.0 / 3 * 100;
            } else if (real < 0) {
                score = 0.001;
            } else {
                score = 100;
            }
        } else if (target > 0) {
            if (real <= target) {
                score = real / target * 2.0 / 3 * 100;
                if (score <= 0) {
                    score = 0.001;
                }
            } else {
                score = 2.0 / 3 * 100 + (real - target) / target * 1.0 / 3 * 100 / 0.2;
            }
        } else if (target < 0) {
            if (real >= target) {
                score = 2.0 / 3 * 100 + ((target - real) / target) * 100 * 1.0 / 3;
                if (score > 100) {
                    score = 100;
                }
            } else {
                score = 2.0 / 3 * 100 + ((target - real) / target) * 100;
                if (score <= 0) {
                    score = 0.001;
                }
            }
        }
    } else if (operator == "<=") {
        if (target == 0) {
            if (real == 0) {
                score = 2.0 / 3 * 100;
            } else if (real < 0) {
                score = 100;
            } else {
                score = 0.001;
                if (score <= 0) {
                    score = 0.001;
                }
            }
        } else if (target > 0) {
            score = 100 + (target - real) / target * 100;
            if (score <= 0) {
                score = 0.001;
            } else if (score <= 100) {
                score = score * 2.0 / 3;
            } else if (score > 100) {
                if (score > 120) {
                    score = 100;
                } else {
                    score = 2.0 / 3 * 100 + (score - 100) * (1.0 / 3 * 100) / 20;
                }
            }
        } else if (target < 0) {
            if (real <= target) {
                score = 2.0 / 3 * 100 - ((target - real) / target) * 100 * 1.0 / 3;
                if (score > 100) {
                    score = 100;
                }
            } else {
                score = 2.0 / 3 * 100 - ((target - real) / target) * 100;
                if (score <= 0) {
                    score = 0.001;
                }
            }
        }
    } else {
        if (real == target) {
            score = 2.0 / 3 * 100;
        } else {
            score = 0.001;
        }
    }
    return score;
}

function show_percent(val) {
    if (val == null) {
        return 'N/A';
    }
    else {
        return val.toFixed(1) + "%";
    }
}
function show_percent_(val) {
    if (val == null) {
        return 'N/A';
    }
    percent_100 = 2.0 / 3 * 100;
    if (val <= percent_100) {
        return (val * 100 / (2.0 / 3 * 100)).toFixed(1) + "%";
    } else {
        return (100 + (val - percent_100) * 20 / (1.0 / 3 * 100)).toFixed(1) + "%";
    }
}

function isEmpty(val) {
    if (val == null) {
        return true;
    }
    if (val === '' || val == null) {
        return true;
    }
    return false;
}
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

var module = angular.module('cloudjet', ['angularFileUpload', 'ngSanitize']);

module.controller('UploadFileCtrl', ['$scope', '$upload', function ($scope, $upload) {
    $scope.onFileSelect = function ($files, kpi) {
        // $files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $("#progress-" + kpi.unique_key).show();
            $("#file-" + kpi.unique_key).hide();
            $("#confile-" + kpi.unique_key).hide();
            $scope.upload = $upload.upload({
                url: '/performance/file-upload/' + kpi.unique_key + '/', //upload.php script, node.js route, or servlet url
                method: 'POST',
                // headers: {'header-key': 'header-value'},
                // withCredentials: true,
                data: { datafile: 'datafile' },
                file: file, // or list of files: $files for html5 only
                /* set the file formData name ('Content-Desposition'). Default is 'file' */
                //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                //formDataAppender: function(formData, key, val){}
            }).progress(function (evt) {
                percent = parseInt(100.0 * evt.loaded / evt.total);
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                $("#progress-" + kpi.unique_key + " .bar").css('width', percent + "%");
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                $("#progress-" + kpi.unique_key).hide();
                console.log(data);
                $("#kpi-" + data.unique_key).val(data.obj_id);
                $("#uploaded-file-" + data.unique_key).html("File: <a href='" + data.file_url + "'>" + data.file_name + "</a>");
            }).error(function () {
                var control = $("#file-" + kpi.unique_key);
                control.replaceWith(control = control.clone(true));
                $("#file-" + kpi.unique_key).show();
                $("#progress-" + kpi.unique_key).hide();
                $("#confile-" + kpi.unique_key).show();
                alert('Upload file failed!')
            });
            //.then(success, error, progress);
            //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
        }
        /* alternative way of uploading, send the file binary with the file's content-type.
         Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
         It could also be used to monitor the progress of a normal http post/put request with large data*/
        // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
    };
}]);
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return "ga_" + text;
}

function dateFormat(date, format) {
    // Calculate date parts and replace instances in format string accordingly
    format = format.replace("DD", (date.getDate() < 10 ? '0' : '')
        + date.getDate());
    format = format.replace("MM", (date.getMonth() < 9 ? '0' : '')
        + (date.getMonth() + 1));
    format = format.replace("YYYY", date.getFullYear());
    return format;
}
function update_goal(obj, id, user_id, type) {
    var value = $(obj).val();
    var data = {
        id: id,
        user_id: user_id
    };
    if (type == 1) {
        data['current_goal'] = value;
    } else if (type == 2) {
        data['future_goal'] = value;
    }
    cloudjetRequest.ajax({
        type: 'POST',
        data: data,
        url: "/performance/team-performance/update/",
        beforeSend: function () {
            $("#waiting").show();
        },
        success: function (data) {
            $("#waiting").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#waiting").hide();
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        }
    });
}
function update_note(obj, id, user_id, type) {
    var value = $(obj).val();
    var data = {
        id: id,
        user_id: user_id
    };
    if (type == 1) {
        data['manager_note'] = value;
    } else if (type == 2) {
        data['self_note'] = value;
    } else if (type == 3) {
        data['evidence_manager'] = value;
    } else if (type == 4) {
        data['evidence_self'] = value;
    }
    cloudjetRequest.ajax({
        type: 'POST',
        data: data,
        url: "/performance/team-performance/update/",
        beforeSend: function () {
            $("#waiting").show();
        },
        success: function (data) {
            $("#waiting").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#waiting").hide();
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        }
    });
}
function update_plan(obj, id, type) {
    var value = $(obj).val();
    var data = {
        id: id
    };
    if (type == 1) {
        data['short_term_career'] = value;
    } else if (type == 2) {
        data['short_term_development'] = value;
    } else if (type == 3) {
        data['long_term_career'] = value;
    } else if (type == 4) {
        data['long_term_development'] = value;
    } else {
        return;
    }
    $("#waiting").show();
    cloudjetRequest.ajax({
        type: 'POST',
        data: data,
        url: "/performance/update-plan/",
        beforeSend: function () {
            $("#waiting").show();
        },
        success: function (data) {
            $("#waiting").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#waiting").hide();
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        }
    });
}
function calculate_real(kpi) {
     var real = kpi.real;
    if (kpi.review_type == 'monthly') {
        month_1 = parseFloat(kpi.month_1);
        month_2 = parseFloat(kpi.month_2);
        month_3 = parseFloat(kpi.month_3);
        if ( isNaN(month_1) ){ month_1 = 0}
        if ( isNaN(month_2)){ month_2 = 0}
        if ( isNaN(month_3)){ month_3 = 0}


        if (kpi.score_calculation_type == 'sum') {


            real = month_1 + month_2 + month_3;

        } else if (kpi.score_calculation_type == 'average') {
            real = 0;
            var i = 0;
            if (kpi.month_1 || kpi.month_1 === 0) {
                real = month_1;
                i = 1;
            }

            if (kpi.month_2 || kpi.month_2 === 0) {
                real += month_2;
                i += 1;
            }
            if (kpi.month_3 || kpi.month_3 === 0) {
                real += month_3;
                i += 1;
            }

            if (i == 0) {
                i = 1;
            }

            real = real / i;


        }
         else {
           if (kpi.month_3  || kpi.month_3 === 0) {
                real = month_3;

            }else if (kpi.month_2 || kpi.month_2 === 0) {
                real = month_2;

            }else    if (kpi.month_1 || kpi.month_1 === 0) {
                real = month_1;

            }




        }

    }

     // kpi.real = real;
    return parseFloat(real);
}