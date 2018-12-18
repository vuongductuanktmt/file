
$(function(){
	var md = new MobileDetect(window.navigator.userAgent);
	if(md.mobile()){//if is mobile
		localStorage.setItem('column-left', '');
	} 
});
function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
//copy from js/widget.js
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires+"; path=/";;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}
//# end copy from js/widget.js


function getURLVar(key) {
	var value = [];

	var query = String(document.location).split('?');

	if (query[1]) {
		var part = query[1].split('&');

		for (i = 0; i < part.length; i++) {
			var data = part[i].split('=');

			if (data[0] && data[1]) {
				value[data[0]] = data[1];
			}
		}

		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	}
}





$(document).ready(function() {
	//Form Submit for IE Browser
	$('button[type=\'submit\']').on('click', function() {
		$("form[id*='form-']").submit();
	});

	// Highlight any found errors
	$('.text-danger').each(function() {
		var element = $(this).parent().parent();
		
		if (element.hasClass('form-group')) {
			element.addClass('has-error');
		}
	});
	
	// Set last page opened on the menu
	/* 
	 //Duan comment
	$('#menu a[href]').on('click', function() {
		sessionStorage.setItem('menu', $(this).attr('href'));
	});
	*/
	
	/* use new UI */
	localStorage.setItem('use_old_ui', '');
	
	
	//sessionStorage.setItem('menu', $('#kpi-editor-menu-item').attr('href'));
	
	var pattern = new RegExp('.*/performance/kpi-editor/?');
	if(pattern.test(location.pathname)){
		sessionStorage.setItem('menu', $('#kpi-editor-menu-item').attr('href'));
	}
	else{
		sessionStorage.setItem('menu', $('#kpi-learning-menu-item').attr('href'));
	}

	if (!sessionStorage.getItem('menu')) {
		$('#menu #dashboard').addClass('active');
	} else {
		// Sets active and open to selected page in the left column menu.
		$('#menu a[href=\'' + sessionStorage.getItem('menu') + '\']').parents('li').addClass('active open');
	}

	if (localStorage.getItem('column-left') == 'active') {
		$('#button-menu i').replaceWith('<i class="fa fa-dedent fa-3x"></i>');
		
		$('#column-left').addClass('active');
		$('#header').addClass('column-left-active');
		
		// Slide Down Menu
		$('#menu li.active').has('ul').children('ul').addClass('collapse in');
		$('#menu li').not('.active').has('ul').children('ul').addClass('collapse');
	} else {
		$('#button-menu i').replaceWith('<i class="fa fa-indent fa-2x"></i>');
		$('#header').removeClass('column-left-active');
		
		$('#menu li li.active').has('ul').children('ul').addClass('collapse in');
		$('#menu li li').not('.active').has('ul').children('ul').addClass('collapse');
	}

	// Menu button
	$('#button-menu').on('click', function() {
		// Checks if the left column is active or not.
		if ($('#column-left').hasClass('active')) {
			localStorage.setItem('column-left', '');

			$('#button-menu i').replaceWith('<i class="fa fa-indent fa-2x"></i>');

			$('#column-left').removeClass('active');
			$('#header').removeClass('column-left-active');

			$('#menu > li > ul').removeClass('in collapse');
			$('#menu > li > ul').removeAttr('style');
		} else {
			localStorage.setItem('column-left', 'active');

			$('#button-menu i').replaceWith('<i class="fa fa-dedent fa-2x"></i>');
			
			$('#column-left').addClass('active');
			$('#header').addClass('column-left-active');
			
			// Add the slide down to open menu items
			$('#menu li.open').has('ul').children('ul').addClass('collapse in');
			$('#menu li').not('.open').has('ul').children('ul').addClass('collapse');
		}
	});

	// Menu
	$('#menu').find('li').has('ul').children('a').on('click', function() {
		if ($('#column-left').hasClass('active')) {
			$(this).parent('li').toggleClass('open').children('ul').collapse('toggle');
			$(this).parent('li').siblings().removeClass('open').children('ul.in').collapse('hide');
		} else if (!$(this).parent().parent().is('#menu')) {
			$(this).parent('li').toggleClass('open').children('ul').collapse('toggle');
			$(this).parent('li').siblings().removeClass('open').children('ul.in').collapse('hide');
		}
	});
	
	
	
	// tooltips on hover
	//$('[data-toggle=\'tooltip\']').tooltip({container: 'body', html: true});
	
	function kpi_qtipfunc(kpi_row, overwrite){
		var is_overwrite=false, container;
		if(overwrite){
			is_overwrite=true;
		}else{
			is_overwrite=false;
		}
		if(kpi_row){
			container=kpi_row;
		}else{
			container=document;
		}
		$(container).find('.kpi-unit .cell-content, .kpi-current-goal .cell-content').each(function(){
        	//alert('show');
			
        	$(this).qtip({
        		overwrite:is_overwrite,
        		metadata: {
        	        type: 'html5',
        	        name: 'qtipopts'
        	    },
        	    /*
        		content:{
        			attr:'title'
        		},
        		*/
        	    content:$(this).children('.tooltiptext'),//.length>0?$(this).children('.tooltiptext'):{attr:'title'},
        		style:{ classes: 'qtip-green' },
        		show: {
        	        target: $($(this).closest('.kpi-row').find('.kpi-id')).add(this) //$(this).find('.kpi-operator .cell-content, .kpi-unit .cell-content')
        	    },
        	    /*
        	    hide: {
//        	        target: $(this).closest('.kpi-row').find('.kpi-id')
        	        target: $($(this).closest('.kpi-row').find('.kpi-id')).add(this)
        	    },
        	    */
        	    hide: {
        	    	target: $($(this).closest('.kpi-row').find('.kpi-id')).add(this),
                    fixed: true,
                    delay: 300
                }
        	});
        });
	}
	
	
	/*
	 * only for menu
	 */
	$('#column-left [data-toggle=\'tooltip\']').qtip({
		metadata: {
	        type: 'html5',
	        name: 'qtipopts'
	    },
		content:{
			attr:'title'
		},
		style:{ classes: 'qtip-dark' } 
	});
	/* general tooltip */
	$('[data-toggle="tooltip"]').qtip({
		overwrite:false,
    	metadata: {
	        type: 'html5',
	        name: 'qtipopts'
	    },
		content:{
			attr:'title'
		},
		style:{ classes: 'qtip-green' },
		hide: {
            fixed: true,
            delay: 300
        }
    });
	
	// Makes tooltips work on ajax generated content
	$(document).ajaxStop(function() {
		//$('[data-toggle=\'tooltip\']').tooltip({container: 'body', html: true});
		//data-toggle="tooltip"
		/*
        $('.kpi-row [data-toggle="tooltip"]').qtip({
        	overwrite:false,
        	metadata: {
    	        type: 'html5',
    	        name: 'qtipopts'
    	    },
    		content:{
    			attr:'title'
    		},
    		style:{ classes: 'qtip-green' },
    		hide: {
                fixed: true,
                delay: 300
            }
        });
        
        kpi_qtipfunc();
        */
       
	});
	
	// https://github.com/opencart/opencart/issues/2595
	/*
	$.event.special.remove = {
		remove: function(o) {
			if (o.handler) { 
				o.handler.apply(this, arguments);
			}
		}
	}
	
	
	$('[data-toggle=\'tooltip\']').on('remove', function() {
		$(this).tooltip('destroy');
	});	
	*/
});

// Autocomplete */
(function($) {
	$.fn.autocomplete = function(option) {
		return this.each(function() {
			this.timer = null;
			this.items = new Array();
	
			$.extend(this, option);
	
			$(this).attr('autocomplete', 'off');
			
			// Focus
			$(this).on('focus', function() {
				this.request();
			});
			
			// Blur
			$(this).on('blur', function() {
				setTimeout(function(object) {
					object.hide();
				}, 200, this);				
			});
			
			// Keydown
			$(this).on('keydown', function(event) {
				switch(event.keyCode) {
					case 27: // escape
						this.hide();
						break;
					default:
						this.request();
						break;
				}				
			});
			
			// Click
			this.click = function(event) {
				event.preventDefault();
	
				value = $(event.target).parent().attr('data-value');
	
				if (value && this.items[value]) {
					this.select(this.items[value]);
				}
			}
			
			// Show
			this.show = function() {
				var pos = $(this).position();
	
				$(this).siblings('ul.dropdown-menu').css({
					top: pos.top + $(this).outerHeight(),
					left: pos.left
				});
	
				$(this).siblings('ul.dropdown-menu').show();
			}
			
			// Hide
			this.hide = function() {
				$(this).siblings('ul.dropdown-menu').hide();
			}		
			
			// Request
			this.request = function() {
				clearTimeout(this.timer);
		
				this.timer = setTimeout(function(object) {
					object.source($(object).val(), $.proxy(object.response, object));
				}, 200, this);
			}
			
			// Response
			this.response = function(json) {
				html = '';
	
				if (json.length) {
					for (i = 0; i < json.length; i++) {
						this.items[json[i]['value']] = json[i];
					}
	
					for (i = 0; i < json.length; i++) {
						if (!json[i]['category']) {
							html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
						}
					}
	
					// Get all the ones with a categories
					var category = new Array();
	
					for (i = 0; i < json.length; i++) {
						if (json[i]['category']) {
							if (!category[json[i]['category']]) {
								category[json[i]['category']] = new Array();
								category[json[i]['category']]['name'] = json[i]['category'];
								category[json[i]['category']]['item'] = new Array();
							}
	
							category[json[i]['category']]['item'].push(json[i]);
						}
					}
	
					for (i in category) {
						html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';
	
						for (j = 0; j < category[i]['item'].length; j++) {
							html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
						}
					}
				}
	
				if (html) {
					this.show();
				} else {
					this.hide();
				}
	
				$(this).siblings('ul.dropdown-menu').html(html);
			}
			
			$(this).after('<ul class="dropdown-menu"></ul>');
			$(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));	
			
		});
	}
})(window.jQuery);


//var csrftoken = getCookie((typeof CSRF_COOKIE_NAME === 'undefined') ? 'csrftoken' : CSRF_COOKIE_NAME);


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});