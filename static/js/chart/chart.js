/*
!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s,o,u,a;this.type=t;this.$element=e(n);this.options=this.getOptions(r);this.enabled=true;o=this.options.trigger.split(" ");for(a=o.length;a--;){u=o[a];if(u=="click"){this.$element.on("click."+this.type,this.options.selector,e.proxy(this.toggle,this))}else if(u!="manual"){i=u=="hover"?"mouseenter":"focus";s=u=="hover"?"mouseleave":"blur";this.$element.on(i+"."+this.type,this.options.selector,e.proxy(this.enter,this));this.$element.on(s+"."+this.type,this.options.selector,e.proxy(this.leave,this))}}this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){t=e.extend({},e.fn[this.type].defaults,this.$element.data(),t);if(t.delay&&typeof t.delay=="number"){t.delay={show:t.delay,hide:t.delay}}return t},enter:function(t){var n=e.fn[this.type].defaults,r={},i;this._options&&e.each(this._options,function(e,t){if(n[e]!=t)r[e]=t},this);i=e(t.currentTarget)[this.type](r).data(this.type);if(!i.options.delay||!i.options.delay.show)return i.show();clearTimeout(this.timeout);i.hoverState="in";this.timeout=setTimeout(function(){if(i.hoverState=="in")i.show()},i.options.delay.show)},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(this.timeout)clearTimeout(this.timeout);if(!n.options.delay||!n.options.delay.hide)return n.hide();n.hoverState="out";this.timeout=setTimeout(function(){if(n.hoverState=="out")n.hide()},n.options.delay.hide)},show:function(){var t,n,r,i,s,o,u=e.Event("show");if(this.hasContent()&&this.enabled){this.$element.trigger(u);if(u.isDefaultPrevented())return;t=this.tip();this.setContent();if(this.options.animation){t.addClass("fade")}s=typeof this.options.placement=="function"?this.options.placement.call(this,t[0],this.$element[0]):this.options.placement;if(e("rect",e("svg")).length>0){t.remove().css({top:0,left:0,display:"block"}).prependTo(document.body);n=e.extend({},this.$element.offset(),{width:this.$element[0].getBoundingClientRect().width,height:this.$element[0].getBoundingClientRect().height})}else{t.detach().css({top:0,left:0,display:"block"}).insertAfter(this.$element);n=this.getPosition(inside)}n=this.getPosition();r=t[0].offsetWidth;i=t[0].offsetHeight;switch(s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width};break}this.applyPlacement(o,s);this.$element.trigger("shown")}},applyPlacement:function(e,t){var n=this.tip(),r=n[0].offsetWidth,i=n[0].offsetHeight,s,o,u,a;n.offset(e).addClass(t).addClass("in");s=n[0].offsetWidth;o=n[0].offsetHeight;if(t=="top"&&o!=i){e.top=e.top+i-o;a=true}if(t=="bottom"||t=="top"){u=0;if(e.left<0){u=e.left*-2;e.left=0;n.offset(e);s=n[0].offsetWidth;o=n[0].offsetHeight}this.replaceArrow(u-r+s,s,"left")}else{this.replaceArrow(o-i,o,"top")}if(a)n.offset(e)},replaceArrow:function(e,t,n){this.arrow().css(n,e?50*(1-e/t)+"%":"")},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t);e.removeClass("fade in top bottom left right")},hide:function(){function i(){var t=setTimeout(function(){n.off(e.support.transition.end).detach()},500);n.one(e.support.transition.end,function(){clearTimeout(t);n.detach()})}var t=this,n=this.tip(),r=e.Event("hide");this.$element.trigger(r);if(r.isDefaultPrevented())return;n.removeClass("in");e.support.transition&&this.$tip.hasClass("fade")?i():n.detach();this.$element.trigger("hidden");return this},fixTitle:function(){var e=this.$element;if(e.attr("title")||typeof e.attr("data-original-title")!="string"){e.attr("data-original-title",e.attr("title")||"").attr("title","")}},hasContent:function(){return this.getTitle()},getPosition:function(){var t=this.$element[0];return e.extend({},typeof t.getBoundingClientRect=="function"?t.getBoundingClientRect():{width:t.offsetWidth,height:t.offsetHeight},this.$element.offset())},getTitle:function(){var e,t=this.$element,n=this.options;e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title);return e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},arrow:function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null}},enable:function(){this.enabled=true},disable:function(){this.enabled=false},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(t){var n=t?e(t.currentTarget)[this.type](this._options).data(this.type):this;n.tip().hasClass("in")?n.hide():n.show()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}};var n=e.fn.tooltip;e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;if(!i)r.data("tooltip",i=new t(this,s));if(typeof n=="string")i[n]()})};e.fn.tooltip.Constructor=t;e.fn.tooltip.defaults={animation:true,placement:"top",selector:false,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:false,container:false};e.fn.tooltip.noConflict=function(){e.fn.tooltip=n;return this}}(window.jQuery);!function(e){"use strict";var t=function(e,t){this.init("popover",e,t)};t.prototype=e.extend({},e.fn.tooltip.Constructor.prototype,{constructor:t,setContent:function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.options.html?"html":"text"](t);e.find(".popover-content")[this.options.html?"html":"text"](n);e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var e,t=this.$element,n=this.options;e=(typeof n.content=="function"?n.content.call(t[0]):n.content)||t.attr("data-content");return e},tip:function(){if(!this.$tip){this.$tip=e(this.options.template)}return this.$tip},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}});var n=e.fn.popover;e.fn.popover=function(n){return this.each(function(){var r=e(this),i=r.data("popover"),s=typeof n=="object"&&n;if(!i)r.data("popover",i=new t(this,s));if(typeof n=="string")i[n]()})};e.fn.popover.Constructor=t;e.fn.popover.defaults=e.extend({},e.fn.tooltip.defaults,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'});e.fn.popover.noConflict=function(){e.fn.popover=n;return this}}(window.jQuery)
	*/
var paper;
var grp_text;
var person;
var person_grid;
var w = 187;
var kite;
var p_arrows = [];
var popup1, popup2;

function h_in() {
	this.attr({stroke: '#99cc00'});
	this.toFront();
	grp_text.forEach(function(obj) {
		obj.toFront();
	});
	if (kite) {
		kite.toFront();
	}
	if(person) {
		person.forEach(function(obj) {
			obj.toFront();
		});
	}
	if (p_arrows) {
		for (i in p_arrows) {
			p_arrows[i].toFront();
		}		
	}
    if (popup1) {
        popup1.flag.toFront();
    }
    if (popup2) {
        popup2.flag.toFront();
    }
}

function h_out() {
	this.attr({stroke: '#ccc'});
	this.data("hovered", false);
}

function drawGrap() {
	var color = "#ccc";
	var options = { 'fill': '#ffffff',stroke: color, 'cursor':'pointer'};
	r00 = paper.rect(0, 0, w, w).attr(options);
	r00.hover(h_in, h_out);
	r00.node.xx = 0;
	r00.node.yy = 0;
	r00.node.id = "performing";
	r01 = paper.rect(w, 0, w, w).attr(options);
	r01.hover(h_in, h_out);
	r01.node.xx = w;
	r01.node.yy = 0;
	r01.node.id = "achieving";
	r02 = paper.rect(w*2, 0, w, w).attr(options);
	r02.hover(h_in, h_out);
	r02.node.xx = w*2;
	r02.node.yy = 0;
	r02.node.id = "starring";

	r10 = paper.rect(0, w, w, w).attr(options);
	r10.hover(h_in, h_out);
	r10.node.xx = 0;
	r10.node.yy = w;
	r10.node.id = "processing";
	r11 = paper.rect(w, w, w, w).attr(options);
	r11.hover(h_in, h_out);
	r11.node.xx = w;
	r11.node.yy = w;
	r11.node.id = "contributing";
	r12 = paper.rect(w*2, w, w, w).attr(options);
	r12.hover(h_in, h_out);
	r12.node.xx = w*2;
	r12.node.yy = w;
	r12.node.id = "promising";

	r20 = paper.rect(0, w*2, w, w).attr(options);
	r20.hover(h_in, h_out);
	r20.node.xx = 0;
	r20.node.yy = w*2;
	r20.node.id = "under-performing";
	r21 = paper.rect(w, w*2, w, w).attr(options);
	r21.hover(h_in, h_out);
	r21.node.xx = w;
	r21.node.yy = w*2;
	r21.node.id = "under-contributing";
	r22 = paper.rect(w*2, w*2, w, w).attr(options);
	r22.hover(h_in, h_out);
	r22.node.xx = w*2;
	r22.node.yy = w*2;
	r22.node.id = "latent";
	
	r00.translate(0.5, 0.5);
	r01.translate(0.5, 0.5);
	r02.translate(0.5, 0.5);
	r10.translate(0.5, 0.5);
	r11.translate(0.5, 0.5);
	r12.translate(0.5, 0.5);
	r20.translate(0.5, 0.5);
	r21.translate(0.5, 0.5);
	r22.translate(0.5, 0.5);
	
	grp_text = paper.set();
	grp_text.push(
		paper.text(5,11,gettext('Performing/Delivering')).attr({'font-size':12,'text-anchor':'start'}),
		paper.text(5,198,gettext('Processing')).attr({'font-size':12,'text-anchor':'start'}),
		paper.text(5,385,gettext('Under-Performing')).attr({'font-size':12,'text-anchor':'start'}),
		
		paper.text(w+5,11,gettext('Achieving')).attr({'font-size':12,'text-anchor':'start'}),
		paper.text(w+5,w+11,gettext('Contributing')).attr({'font-size':12,'text-anchor':'start'}),
		paper.text(w+5,w*2+11,gettext('Under-Contributing')).attr({'font-size':12,'text-anchor':'start'}),
		
		paper.text(w*2+5,11,gettext('Starring')).attr({'font-size':12,'text-anchor':'start'}),
		paper.text(w*2+5,w+11,gettext('Promising')).attr({'font-size':12,'text-anchor':'start'}),
		paper.text(w*2+5,w*2+11,gettext('Latent')).attr({'font-size':12,'text-anchor':'start'})
	);
}

function clearPerson() {
	if (person) {
		person.remove();
		person.clear();
	}	
}
function clearKite() {
	if (kite) {
		kite.remove();
	}	
}
function clearArrow() {
	for (i in p_arrows) {
		if (p_arrows[i]) {
			p_arrows[i].remove();
		}	
	}
	p_arrows = []
}
function drawPerson(x,y,brief_name) {
	clearPerson();
	person = paper.set();
	img = paper.image("//88.cjs.vn/img/csb/person-m.png", x-15,y-23,29,45);
	img.node.id = "perons-position";
	person.push(
		img,
		paper.text(x+6-15,y+25-23,brief_name).attr({'font-size':12,'fill': '#fff',"text-anchor": "start", "font-weight": "bold"})
	);
	person.attr({'cursor':"pointer"});
	return person;
}
function drawKite(min_x, max_x, min_y, max_y, x,y) {
	clearKite();
	path = 'M' + min_x + ',' + y + ', ' +
	       'L' + x + ',' + min_y + ', ' +
	       'L' + max_x + ',' + y + ', ' +
	       'L' + x + ',' + max_y + 'z';
	kite = paper.path(path).attr({fill: "#ccc", stroke: "#0303fa", "stroke-width": 4,opacity:0.5, "stroke-linejoin": "round"});
}
function show_popup() {
    if (this.node.y1 > this.node.y2) {
        pos1 = "down";
        pos2 = "up";
    } else {
        pos1 = "up";
        pos2 = "down";
    }

    popup1 = paper.circle(this.node.x1, this.node.y1, 1);
    popup1.flag = paper.popup(this.node.x1, this.node.y1, this.node.name1, pos1);
    popup2 = paper.circle(this.node.x2, this.node.y2, 1);
    popup2.flag = paper.popup(this.node.x2, this.node.y2, this.node.name2, pos2);
}
function hide_popup () {
    if(popup1) {
        popup1.flag.animate({opacity: 0}, 300, function () { this.remove()});
    }
    if (popup2) {
        popup2.flag.animate({opacity: 0}, 300, function () { this.remove() });
    }
}
function drawArrow(x, y, to_x, to_y, arrow, name1, name2) {
	if (x == to_x || y == to_y) {
		return;
	}
	path = 'M' + x + ',' + y + ', ' +
		   'L' + to_x + ',' + to_y;
	if (arrow) {
		p_arrow = paper.path(path).attr({"stroke": "brown", 
			 "stroke-width": 2, 
			 "arrow-end": "classic-wide-long", 
			 "arrow-start": "oval-midium-midium",
			 'title': "Test"})
	} else {
        p_arrow = paper.path(path).attr({"stroke": "brown",
            "stroke-width": 2,
            'stroke-dasharray': '-',
            "arrow-end": "classic-wide-long",
            "arrow-start": "oval-midium-midium",
            'title': "Test"})
    }
    p_arrow.node.x1 = x;
    p_arrow.node.y1 = y;
    p_arrow.node.name1 = "Đánh giá: " + name1;
    p_arrow.node.x2 = to_x;
    p_arrow.node.y2 = to_y;
    p_arrow.node.name2 = "Đánh giá: " + name2;
    p_arrow.hover(show_popup, hide_popup);
	p_arrows.push(p_arrow);
}

function render_fix() {
	$('tspan').attr('dy', 5);
	paper.renderfix();
	paper.safari();
}
$(document).ready(function() {	
	if($('#chart').length>0){
		paper = new Raphael($('#chart').get(0), 562, 562);
		drawGrap();
	}
	
	//$('svg').attr("shape-rendering", "crispEdges");	
});
