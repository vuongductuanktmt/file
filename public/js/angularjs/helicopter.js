var module = angular.module('cloudjet', []);

function HelicopterCtrl($scope, $http, $filter) {

	$http.get('/performance/helicopter/?json_data=true').success(
			function(data) {
				$scope.people = data[0];
				$scope.filteredPeople = data[0];
				$scope.list_name = data[1];
				$scope.filteredPeople[$scope.currentPerson];
				$scope.changePerson($scope.currentPerson);
				$scope.init_search();
				$('#loading').hide();
			});
	$scope.currentPerson = 0;
	$scope.filteredPeople = [];
	$scope.person = null;
	$scope.list_name = null;
	$scope.quarter_period = current_quarter;

	$scope.changePerson = function(index) {
		$scope.currentPerson = index;
		$scope.person = $scope.filteredPeople[$scope.currentPerson];
	};
	
	$scope.show_person = function (p) {
		var x_score = p.competency_final_score;
		var y_score = p.kpi_final_score;
		x_score = x_score * 564 / 100;
		y_score = 564 - y_score * 564 / 100;
		return {
			left: x_score + "px",
			top: y_score + "px"
		};
	};
	
	$scope.search = function() {
		$scope.filteredPeople = $filter('filter')(
			$scope.people,
			function(item) {
				if ($scope.query == "") {
					return true;
				}
				if (item.name.indexOf($scope.query) != -1) {
					return true;
				}
				return false;
			});	
		$scope.currentPerson = 0;
		$scope.person = $scope.filteredPeople[$scope.currentPerson];
	};
	
	$scope.init_search = function () {
		$(".search-query").typeahead({
			source: $scope.list_name,
			updater: function (item) {
				$scope.query = item;
				$scope.search();
				$scope.$apply();
				return item;
			}
		});
	};
	
	$scope.load_data = function () {
		$scope.people = [];
		$scope.filteredPeople = [];
		$('#loading').show();
		$http.get('/performance/helicopter/?json_data=true&quarter_period='+$scope.quarter_period).success(
			function(data) {
				$scope.people = data[0];
				$scope.filteredPeople = data[0];
				$scope.list_name = data[1];
				$scope.filteredPeople[$scope.currentPerson];
				$scope.changePerson($scope.currentPerson);
				$scope.init_search();
				$('#loading').hide();
		});
	};
};

HelicopterCtrl.$inject = [ '$scope', '$http', '$filter' ];

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