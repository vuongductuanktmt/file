var module = angular.module('cjet', [ 'filters' ]);

angular.module('filters', []).filter('truncate', function() {
	return function(text, length, end) {
		if (isNaN(length)) {
			length = 10;
		}

		if (end === undefined) {
			end = "...";
		}

		if (text.length <= length || text.length - end.length <= length) {
			return text;
		} else {
			return String(text).substring(0, length - end.length) + end;
		}

	};
});

angular.module('filters', []).filter('intcomma', function() {
	return function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	};
});
