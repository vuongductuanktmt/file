function _x(x) {
	return x * 561 / 100;
}
function _y(y) {
	return 561 - y * 561 / 100;
}

function show_popover() {
	$("#perons-position").popover('show');
}
function show_analysis_modal() {
	$('#perons-position').popover('hide');
	$('#individual-grid').modal();
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}
var param = getURLParameter('hash_key');
var hash_key = param != null ? '&hash_key=' +param: "";
function Review360Ctrl($scope, $http, $filter) {
	$http.get('/performance/360-review/?json_data=true' + hash_key).success(
			function(data) {
				$scope.people = data;
				$scope.filteredPeople = data;
				$scope.filteredPeople[$scope.currentPerson];
				$scope.changePerson($scope.currentPerson);
				$scope.update_progress();
				$('#loading').hide();
				$('.progress-note').show();
			});
	
	$scope.currentPerson = 0;
	$scope.filteredPeople = [];
	$scope.person = null;
	$scope.descriptions = null;
	$scope.choice = 1;
	$scope.init_pos = parseInt($('.main').offset().left + 25 + 40);
	$scope.pre_value = null;
	
	$scope.changePerson = function(index) {
		$scope.currentPerson = index;
		$scope.person = $scope.filteredPeople[$scope.currentPerson];
		if (!$scope.person) {
			return;
		}
	};
	
	$scope.store_comment = function (value) {
		$scope.pre_value = value;
	};
	
	$scope.update_note = function (value, id, user_id) {
		var data = {
			id: id,
			user_id: user_id
		};
		data['comment'] = value;
		
		if ($scope.pre_value != value ) {
			$("#waiting").show();
			$http.post('/performance/360-review/?comment=1&hash_key=' + hash_key, data).success(function(data) {
				$scope.update_progress();
				var percent = $scope.person_progress($scope.person, true);
				$scope.update_review(percent, $scope.person.user_id);
				$("#waiting").hide();
				
			}).error(function(data, status, headers, config) {
				$("#waiting").hide();
				alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
			});
		}
	};
	
	$scope.position = function(score, k, extra) {
		if (isNaN(score)) {
			return {};
		} else {
			if (score > 0) {
				return { left: (score*k + extra) + "px" };
			} else {
				return {};
			}
		}
	};
	
	$scope.search = function() {
		$scope.filteredPeople = $filter('filter')(
			$scope.people,
			function(item) {
				if ($scope.query == "") {
					return true;
				}
				if (item.job_title_name == $scope.query) {
					return true;
				}
				return false;
			});	
		$scope.changePerson(0);
	};
	
	$scope.get_kpi = function (id, parent_id) {
		if (parent_id) {
			var parent = $filter('filter')($scope.person.kpis, function(item) {
				if (item['id'] == parseInt(parent_id)) {
					return true;
				}
				return false;
			});
			return $filter('filter')(parent[0].children, function(item) {
				if (item['id'] == parseInt(id)) {
					return true;
				}
				return false;
			});
		} else {
			return $filter('filter')($scope.person.kpis, function(item) {
				if (item['id'] == parseInt(id)) {
					return true;
				}
				return false;
			});
		}		
	};
	
	$scope.get_competency = function (id, parent_id) {
		if (parent_id) {
			var parent = $filter('filter')($scope.person.competencies, function(item) {
				if (item['id'] == parseInt(parent_id)) {
					return true;
				}
				return false;
			});
			return $filter('filter')(parent[0].children, function(item) {
				if (item['id'] == parseInt(id)) {
					return true;
				}
				return false;
			});
		} else {
			return $filter('filter')($scope.person.competencies, function(item) {
				if (item['id'] == parseInt(id)) {
					return true;
				}
				return false;
			});
		}		
	};
	
	$scope.check_score = function (objs) {
		for(i in objs.children) {
			if (objs.children[i].score > 0) {
				return true;
			} 
		}
		return false;
	};
	
	$scope.reset_score = function (objs) {
		for(i in objs.children) {
			objs.children[i].score = 0;
		}
		return false;
	};
	
	$scope.update_comp = function(id, value, old_value, obj, parent_id) {	
		$("#waiting").show();
		var data = {
			comp_id: id,
			value: value,
			person: $scope.person.user_id,
		};
		$http.post('/performance/360-review/?comp=1&hash_key=' + hash_key, data).success(function(data) {
			var old_score = 0;
			if (typeof data == 'object') {
				result = $scope.get_competency(id, parent_id);
				if (result.length == 1) {
					old_score = result[0].score;
					result[0].score = value;
				}
	
			} else {
				$(obj).css('left', old_value);
				console.log(data);
			}
			// console.log(data);
			$scope.update_progress();
			var percent = $scope.person_progress($scope.person, true);
			old_score = old_score == null ? 0: old_score; 
			if ((old_score == 0 && value>0) || value == 0) {
				$scope.update_review(percent, $scope.person.user_id);
			}
			$("#waiting").hide();
		}).error(function(data, status, headers, config) {
			$("#waiting").hide();
			$(obj).css('left', old_value);
			alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
		});
	};
	
	$scope.get_round_progress = function (p) {
		return Math.round($scope.person_progress(p, true));
	};
	
	$scope.person_progress = function (p, per) {
		return $scope.total_progress();	
	};
	
	$scope.total_progress = function () {
		if (!$scope.person) {
			return 0;
		}
		
		var total = $scope.get_total_job();
		var count = 0;
		for (i in $scope.person.competencies) {
			comp = $scope.person.competencies[i];
			if (comp.comment_evidence && comp.comment_evidence != '') {
				count++;
			}
			for (j in comp.children) {
				child = comp.children[j];
				if (child.score > 0) {
					count++;
				}
			}
		}
		var percent = 0;
		if (total > 0) percent = count / total * 100;
		return Math.round(percent);
	};
	
	$scope.update_progress = function () {
		if (!$scope.person) {
			return;
		}
		var percent = $scope.total_progress();
		$('.progress .bar').css('width', percent + "%");
	};
	
	$scope.get_total_job = function () {
		var total = $scope.person.competencies.length;
		for (i in $scope.person.competencies) {
			comp = $scope.person.competencies[i];
			total += comp.children.length;
		}
		return total;
	};
	
	$scope.update_review = function (percent, user_id) {
		var data = {
			percent: percent,
			user_id: user_id
		};
		$http.post('/performance/360-review/?review=1&hash_key='+ hash_key, data).success(function(data) {
			console.log(data);
		});
	};
	
	$scope.update_status = function () {
		$("#waiting").show();
		$http.post('/performance/360-review/?status=1&hash_key='+ hash_key, {}).success(function(data) {
			$("#waiting").hide();
			window.location.reload();
		});
	};
};

Review360Ctrl.$inject = [ '$scope', '$http', '$filter' ];

function update_note(obj, id, user_id) {
	var value = $(obj).val();
	var data = {
		id: id,
		user_id: user_id
	};
	data['comment'] = value;
	cloudjetRequest.ajax({
        type: 'POST',
        data: data,        			        
        url: "/performance/360-review/?comment=1&hash_key=" + hash_key,
        beforeSend:function() {
        	$("#waiting").show();
        },
        success:function(data) {
        	$("#waiting").hide();
        },
        error:function(jqXHR, textStatus, errorThrown) {	
        	$("#waiting").hide();
        	console.log("Quá trình cập nhật bị lỗi. Hãy thử lại");
        }
	});	
}