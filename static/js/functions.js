/*
 * timeago: a jQuery plugin, version: 0.9.2 (2010-09-14)
 * @requires jQuery v1.2.3 or later
 *
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2008-2010, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
    $.timeago = function(timestamp) {
        if (timestamp instanceof Date) return inWords(timestamp);
        else if (typeof timestamp == "string") return inWords($.timeago.parse(timestamp));
        else return inWords($.timeago.datetime(timestamp));
    };
    var $t = $.timeago;

    $.extend($.timeago, {
        settings: {
            refreshMillis: 60000,
            allowFuture: false,
            strings: {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: "ago",
                suffixFromNow: "from now",
                seconds: "less than a minute",
                minute: "about a minute",
                minutes: "%d minutes",
                hour: "about an hour",
                hours: "about %d hours",
                day: "a day",
                days: "%d days",
                month: "about a month",
                months: "%d months",
                year: "about a year",
                years: "%d years",
                numbers: []
            }
        },
        inWords: function(distanceMillis) {
            var $l = this.settings.strings;
            var prefix = $l.prefixAgo;
            var suffix = $l.suffixAgo;
            if (this.settings.allowFuture) {
                if (distanceMillis < 0) {
                    prefix = $l.prefixFromNow;
                    suffix = $l.suffixFromNow;
                }
                distanceMillis = Math.abs(distanceMillis);
            }

            var seconds = distanceMillis / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var years = days / 365;

            function substitute(stringOrFunction, number) {
                var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
                var value = ($l.numbers && $l.numbers[number]) || number;
                return string.replace(/%d/i, value);
            }

            var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
                seconds < 90 && substitute($l.minute, 1) ||
                minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
                minutes < 90 && substitute($l.hour, 1) ||
                hours < 24 && substitute($l.hours, Math.round(hours)) ||
                hours < 48 && substitute($l.day, 1) ||
                days < 30 && substitute($l.days, Math.floor(days)) ||
                days < 60 && substitute($l.month, 1) ||
                days < 365 && substitute($l.months, Math.floor(days / 30)) ||
                years < 2 && substitute($l.year, 1) ||
                substitute($l.years, Math.floor(years));

            return $.trim([prefix, words, suffix].join(" "));
        },
        parse: function(iso8601) {
            var s = $.trim(iso8601);
            s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
            s = s.replace(/-/,"/").replace(/-/,"/");
            s = s.replace(/T/," ").replace(/Z/," UTC");
            s = s.replace(/([\+-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
            return new Date(s);
        },
        datetime: function(elem) {
            // jQuery's `is()` doesn't play well with HTML5 in IE
            var isTime = $(elem).get(0).tagName.toLowerCase() == "time"; // $(elem).is("time");
            var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
            return $t.parse(iso8601);
        }
    });

    $.fn.timeago = function() {
        var self = this;
        self.each(refresh);

        var $s = $t.settings;
        if ($s.refreshMillis > 0) {
            setInterval(function() { self.each(refresh); }, $s.refreshMillis);
        }
        return self;
    };

    function refresh() {
        var data = prepareData(this);
        if (!isNaN(data.datetime)) {
            $(this).text(inWords(data.datetime));
        }
        return this;
    }

    function prepareData(element) {
        element = $(element);
        if (!element.data("timeago")) {
            element.data("timeago", { datetime: $t.datetime(element) });
            var text = $.trim(element.text());
            if (text.length > 0) element.attr("title", text);
        }
        return element.data("timeago");
    }

    function inWords(date) {
        return $t.inWords(distance(date));
    }

    function distance(date) {
        return (new Date().getTime() - date.getTime());
    }

    // fix for IE6 suckage
    document.createElement("abbr");
    document.createElement("time");
})(jQuery);


$(document).ready(function(){

	//---------------------------
	// Initialize FancyBox
	//---------------------------	
	$(".lightbox").fancybox({
		'speedIn'		:	600, 
		'speedOut'		:	200
	});
	
	//---------------------------
	// Twitter widget
	//---------------------------
	if( $("#twitter").length ){
		
		// Translate the timeago plugin
		jQuery.timeago.settings.strings = { 
			suffixAgo: "ago",
			suffixFromNow: "from now",
			seconds: "Less than a minute",
			minute: "About a minute",
			minutes: "%d minutes",
			hour: "About an hour",
			hours: "About %d hours",
			day: "A day",
			days: "%d days",
			month: "About a month",
			months: "%d months",
			year: "About a year",
			years: "%d years"
		};
		
		var yourTwitterUsername = "mtdsgn"; //Insert your twitter username
		
		cloudjetRequest.ajax({
			url : "http://twitter.com/statuses/user_timeline/"+yourTwitterUsername+".json?callback=?",
			dataType : "json",
			timeout: 15000,
			
			success : function(data){
				var time = data[0].created_at,
					text = data[0].text,
					id = data[0].id_str,
					twitterDiv = $("#twitter").find("div");
					
				time = time.replace(/(\+\S+) (.*)/, '$2');
				time = $.timeago( new Date( Date.parse( time ) ) );
										
				text = text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url){
								return '<a href="'+url+'" target="_blank">'+url+'</a>'});
				text = text.replace(/@(\w+)/g, function(url){
								return '<a href="http://www.twitter.com/'+url.substring(1)+'" target="_blank">'+url+'</a>'});
				text = text.replace(/#(\w+)/g, function(url){
								return '<a href="http://twitter.com/#!/search?q=%23'+url.substring(1)+'" target="_blank">'+url+'</a>'});
				text = "<a href='http://twitter.com/"+yourTwitterUsername+"/status/"+id+"' class='status'>" +time+ "</a> " + text;
				twitterDiv.html(text);
				// Adjust width for older browsers
				twitterDiv.css({ display: "inline"});
				twitterDiv.width( twitterDiv.width() );
				twitterDiv.css({ display: "block"});
			},
			
			error : function(){
				$("#twitter").find("div").html("There was an error connecting to your Twitter account");
			}
		});
		
	}
	
	//---------------------------
	// Content Slider
	//---------------------------
	if( $(".slider").length ){
		
		// Init the slider
		var slider = $(".slider"),
			slideWidth = slider.find("li").eq(0).width(),
			num = slider.find("li").length,
			sliderController = $(".sliderController");

		slider.width( num * slideWidth );
		
		// center the arrows and add click event
		$(".arrow").height(
			slider.height()
		).click( function(){
			slideTo( $(this).attr("rel") );
			return false;
		} );
		
		// build the controller
		for( i=0; i<num; i++ ){
			var li = $('<li><a href="#"></a></li>');
			li.click(function(){
				slideTo( $(this).index() );
				return false;
			}).appendTo(sliderController);
		}
		
		// Set width to the controller to center it
		sliderController.width(
			num * 25
		).find("li").eq(0).addClass("current");
		
		// Do slide
		function slideTo( next ){
			var current = sliderController.find(".current"),
				currentIndex = current.index();
				
			if( next == "right" ) { 
				next = currentIndex + 1;
				if( next == num ) { next = 0; }
			}
			if( next == "left" ) {
				next = currentIndex - 1; 
				if( next < 0 ) { next = num-1; }
			}
			
			if( (next < num) && !(next < 0) ) {
			
				slider.animate({
					left: - ( next * slideWidth )
				});
				
				current.removeClass("current");
				sliderController.find("li").eq(next).addClass("current");
				
			}	
		}
	
	}
	
	//---------------------------
	// Autofilling forms using placeholders
	//---------------------------
	if( !supports_placeholder() ){
		// If your browser does not support placeholders
		$("input[type=text], textarea").each(function(){
			$(this).val($(this).attr('placeholder'));
		}).focus(function(){
			if($(this).val() == $(this).attr('placeholder')) { $(this).val(""); }
		}).blur(function(){
			if($(this).val() == "") { $(this).val($(this).attr('placeholder')); }
		});
	}
	
	// Test placeholder support
	function supports_placeholder() {
		var i = document.createElement('input');
		return 'placeholder' in i;
	}

});



