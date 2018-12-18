var module = angular.module('cjet', []);

module.directive('draggable', function($document) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	      if ($(elm).hasClass('drag-marker')) {
	    	  var left = $(".main").offset().left + 25;
		      var right = left + 605;
		      var old_value = "";
		      elm.draggable({
		    	  axis: 'x', 
		    	  containment : [left,0,right,0],
		    	  start: function(evt,ui) {
		    		  try {
		    			  old_value = $(this).css('left');
		    		  } catch (e) {}
		    	  },
		    	  stop:function(evt,ui){
		    		  console.log($(this).css('left'));		    		  
		    		  var pos = parseInt($(this).css('left').replace("px",""));
		    		  var parent_id = $(this).attr('data-parent');
		    		  var value = pos >= 65 ? pos-65 : 0;
		    		  if ($(this).attr('data-type') == 'kpi') {
		    			  scope.update_kpi($(this).attr('data-id'), value * 100/540, old_value, this,parent_id);
		    		  } else if ($(this).attr('data-type') == 'comp') {
		    			  scope.update_comp($(this).attr('data-id'), value * 100/540, old_value, this,parent_id);
		    		  }
		    	  }
		      });
	      }	      
	    }
	  };
});
module.directive('tinycarousel', function($document) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	elm.tinycarousel({ display: 2 });
	    }
	  };
});
module.directive('popover', function($document) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
    		elm.popover({
    			html: true,
	    		title: gettext("Factor Description") + " <i class='icon-remove close_btn' style='cursor: pointer' onclick=\"$('.btn_help').popover('hide')\" title=\"Close\"></i>",
	    		content: ""
	    	});    	
	    }
	  };
});

module.config(function($httpProvider) {
	$httpProvider.defaults.headers.post['X-CSRFToken'] = getCookie((typeof CSRF_COOKIE_NAME === 'undefined') ? 'csrftoken' : CSRF_COOKIE_NAME);
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
});

module.config(function($httpProvider) {
	$httpProvider.defaults.transformRequest = function(data) {
		if (data === undefined) {
			return data;
		}
		return $.param(data);
	};
});