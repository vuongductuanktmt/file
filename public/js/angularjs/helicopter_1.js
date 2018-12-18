var module = angular.module('cloudjet', []);

function _x(x) {
	return x * 561 / 100;
}
function _y(y) {
	return 561 - y * 561 / 100;
}

function HelicopterCtrl($scope, $http, $filter) {

	$http.get('/performance/helicopter/?json_data=true').success(
			function(data) {
				$scope.people = data[0];
				$scope.filteredPeople = data[0];
				$scope.list_name = data[1];
				people_set = paper.set();
				$scope.show_people();
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
	
	$scope.show_people = function () {		
		for (var i in $scope.filteredPeople) {
			people_set.push($scope.draw_person($scope.filteredPeople[i]));
		}
	}
	
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
		if (people_set) {
			people_set.remove();
			people_set.clear();
		} else {
			people_set = paper.set();
		}
		$http.get('/performance/helicopter/?json_data=true&quarter_period='+$scope.quarter_period).success(
			function(data) {
				$scope.people = data[0];
				$scope.filteredPeople = data[0];
				$scope.list_name = data[1];
				$scope.show_people();
				$scope.changePerson($scope.currentPerson);
				$scope.init_search();
				$('#loading').hide();
		});
	};
	
	$scope.draw_person = function (person) {		
		var x_score = person.competency_final_score;
		var y_score = person.kpi_final_score;
		x_score = _x(x_score);
		y_score = _y(y_score);
		var obj = drawPerson(person, x_score, y_score);
		$scope.popover_person(person, obj);
		return obj;
	};
	
	$scope.popover_person = function(person, obj) {
		content = person.name;
		$("#peron-" + person.user_id).popover({
			html: true,
			title: person.name + "<i class='icon-remove close_btn' style='cursor: pointer' onclick=\"$('#peron-"+person.user_id +"').popover('hide')\" title=\"{% trans 'Close' %}\"></i>",
			content: content
		});
		
		obj.click(function () {
			$("#peron-" + person.user_id).popover('show');
		});
		
		$("#peron-" + person.user_id).tooltip({
			title: person.name
		});
		
		obj.hover(function () {
			$("#peron-" + person.user_id).tooltip('show');
		});
	}
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