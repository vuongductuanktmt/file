var module = cjs;

module.directive('ngModelOnblur', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });         
            });
        }
    };
});

module.directive('tooltip', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	var apply_tooltip = function () {
	    		elm.tooltip({html:true});
	    	};
	    	$timeout(function() {
	    		apply_tooltip();
            }, 100);
	    }
	  };
});

module.directive('datepicker', function($parse) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	var ngModel = $parse(attrs.ngModel);
	    	elm.datepicker({
	    		format: 'dd-mm-yyyy'
	    	}).on('changeDate', function(ev) {
	    		dateText = $(ev.target).val();
	    		scope.$apply(function(scope){
                    ngModel.assign(scope, dateText);
                });
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