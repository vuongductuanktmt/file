


if (!peform_reward_app) {
	var peform_reward_app = angular.module('cloudjet', []);
}
peform_reward_app.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('<<');
	$interpolateProvider.endSymbol('>>');
});

//http://www.ng-newsletter.com/posts/directives.html
peform_reward_app.directive('ngTooltip', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	
	    	 
	    	var apply_tooltip = function () {
	    		elm.tooltip({
	    			html: true,
	    			container: 'body'
	    		});
	    	};
	    	$timeout(function() {
	    		apply_tooltip();
            }, 100);
	    }
	  };
});
peform_reward_app.directive('ngPopover', function($timeout) {
	return {
		restrict: 'A',
		link: function(scope, elm, attrs) {
			
			
			var apply_popover= function () {
				elm.popover({
					html: true,
					container: 'body'
				});
			};
			$timeout(function() {
				apply_popover();
			}, 100);
		}
	};
});
peform_reward_app.directive('ngEmployeetrend', function($timeout) {
	var employee_trend_chart_options=$.extend({}, base_sparkline_options, {width:'100px', height:'30px', tooltipFormat :
		'<div style="">\
		- Month: <span style="font-size:1.5em; font-weight:bold; color:yellow;">{{x}}</span><br> \
		- Performance: <span style="font-size:1.5em; font-weight:bold; color:yellow;"> {{y}} %</span>\
	</div>',});
	return {
		restrict: 'A',
		link: function(scope, elm, attrs) {
			var apply_employee_trend_chart = function () {
				elm.sparkline('html', employee_trend_chart_options);
			};
			$timeout(function() {
				apply_employee_trend_chart();
			}, 100);
		}
	};
});

peform_reward_app.directive('ngOverviewtrend', function($timeout) {
	var overview_trend_chart_options=$.extend({}, base_sparkline_options);
	return {
		restrict: 'A',
		link: function(scope, elm, attrs) {
			var apply_overview_trend_chart = function () {
				elm.sparkline('html', overview_trend_chart_options);
			};
			$timeout(function() {
				apply_overview_trend_chart();
			}, 100);
		}
	};
});


//peform_reward_app.directive('editable', function($timeout) {
//	return {
//	    restrict: 'A',
//	    link: function(scope, elm, attrs) {
////	    	if (!scope.current) {
////	    		return;
////	    	}
//	    	var apply_editable = function () {
//	    		elm.editable({
////	    			url:   '//update-weighting/',
////	    			emptytext: 0,
////	    			inputclass: 'input-mini',
////	    			validate: function (value) {
////	    				if($.trim(value) == '') 
////	    				    return gettext('This field is required.');
////	    				if (isNaN(value)) {
////	    					return gettext('Weighting must be a integer.');
////	    				}
////	    				value = parseInt(value);
////	    				if (value < 0 || value > 100) {	
////	    					return gettext('Weighting must be in range from 0 to 100.');
////	    				}
////	    			},
////	    			success: function (data) {
////	    				var result = scope.get_kpi(data.id, data.parent_id);
////	    				if (result.length == 1) {
////	    					result[0].weight = data.weight;
////	    				}
////	    				var result = scope.get_kpi(data.parent_id);
////	    				if (result.length == 1) {
////	    					result[0].total_weight = data.total_weight;
////	    				}
////	    				scope.$apply();
////	    			}
//	    		});
//	    	};
//	    	
//	    	$timeout(function() {
//	    		apply_editable();
//            }, 300);
//	    }
//	};
//});

/*

peform_reward_app.factory('sharedService', function($rootScope) {  
  	var sharedService = {};
	sharedService.data = {};

	sharedService.prepForBroadcast = function(data) {
	    this.data = data;
	    this.broadcastItem();
	};
	
	sharedService.uploadForBroadcast = function(data) {
	    this.data = data;
	    this.broadcastUpload();
	};
	
	sharedService.broadcastUpload = function() {
        $rootScope.$broadcast('broadcastUpload');
    };
	
	sharedService.cancelForBroadcast = function() {
		this.broadcastCancel();
	};

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };
    
    
    sharedService.broadcastCancel = function() {
        $rootScope.$broadcast('BroadcastCancel');
    };

    return sharedService;
});
*/
peform_reward_app.config(function($httpProvider) {
	$httpProvider.defaults.headers.post['X-CSRFToken'] = getCookie((typeof CSRF_COOKIE_NAME === 'undefined') ? 'csrftoken' : CSRF_COOKIE_NAME);
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
});

peform_reward_app.config(function($httpProvider) {
	$httpProvider.defaults.transformRequest = function(data) {
		if (data === undefined) {
			return data;
		}
		return $.param(data);
	};
});
