function PriceController($scope, $http, $filter) {
	$scope.employee = 30;
	$scope.license = 756000;
	$scope.advisory = 2000000;
	$scope.quarter = 0.1;
	$scope.year = 0.14;
	$scope.maintain = 60000;
	
	$scope.get_range = function () {
		if ($scope.employee <= 30) {
			return 30;
		} else if ($scope.employee <= 60) {
			return 60;
		} else if ($scope.employee <= 80) {
			return 80;
		} else if ($scope.employee <= 100) {
			return 100;
		} else if ($scope.employee <= 150) {
			return 150;
		} else if ($scope.employee <= 250) {
			return 250;
		}
	};
	
	// advisory
	$scope.advisory_by_month = function () {
		var n = $scope.get_range();
		var price = $scope.advisory * n / 72;
		return Math.round(price);
	};
	
	$scope.advisory_by_quarter = function () {
		var n = $scope.get_range();
		var price = $scope.advisory * n / 18;
		return Math.round(price - price * $scope.quarter);
	};
	
	$scope.advisory_by_year = function () {
		var n = $scope.get_range();
		var price = $scope.advisory * n / 6;
		return Math.round(price - price * $scope.year);
	};
	
	// license
	$scope.license_by_month = function () {
		var n = $scope.get_range();
		return Math.round($scope.license * n / 12);
	};
	
	$scope.license_by_quarter = function () {
		var n = $scope.get_range();
		var price = $scope.license * n / 4;
		return Math.round(price - price * $scope.quarter);
	};
	
	$scope.license_by_year = function () {
		var n = $scope.get_range();
		var price = $scope.license * n;
		return Math.round(price - price * $scope.year);
	};
	
	// maintain
	$scope.maintain_by_month = function () {
		var n = $scope.get_range();
		return Math.round($scope.maintain * n / 12);
	};
	
	$scope.maintain_by_quarter = function () {
		var n = $scope.get_range();
		var price = $scope.maintain * n / 4;
		return Math.round(price - price * $scope.quarter);
	};
	
	$scope.maintain_by_year = function () {
		var n = $scope.get_range();
		var price = $scope.maintain * n;
		return Math.round(price - price * $scope.year);
	};
}

PriceController.$inject = [ '$scope', '$http', '$filter' ];