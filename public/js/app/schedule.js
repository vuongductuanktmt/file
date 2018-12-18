/**
 * Created by hongleviet on 12/13/15.
 */

module.controller('ScheduleListCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

	$scope.dues = null;
	$scope.reviews = [];
	$scope.reviewsAll = [];
	$scope.reviewsNotStart = [];
	$scope.reviewsInprogress = [];
	$scope.reviewsComplete = [];
	$scope.manager = false;
	$scope.self = false;
	$scope.review360 = false;
	$scope.current_due = null;
	$scope.show_due = null;
	$scope.type_360 = '';
	$scope.loaded = false;
	//
	// $scope.get_data = function () {
	// 	$http.get('/performance/schedule/?json_data=true').success(
	// 			function(data) {
	// 				$scope.dues = data[0];
	// 				$scope.current_due = $scope.dues.current_due;
	// 				$scope.show_due = $scope.dues.current_due;
	// 				$scope.reviews = data[1];
	// 				$scope.reviewsAll = data[1];
	// 				$scope.reviewsNotStart = $scope.initGrid('not start');
	// 				$scope.reviewsInprogress = $scope.initGrid('in progress');
	// 				$scope.reviewsComplete = $scope.initGrid('complete');
	// 				$("#complete-prgress").html($scope.update_progress() + "%");
	// 				$('#loading').hide();
	// 			});
	// }
	//
	// $scope.load_data = function () {
	// 	if (!$scope.loaded) {
	// 		$scope.loaded = true;
	// 		$("#loading").show();
	// 		$scope.get_data();
	// 	}
	// }

	$scope.filterOptions = {
    	filterText: $scope.filterText,
		useExternalFilter: false
	};

	$scope.columnDefs = [{field: 'name', displayName: 'Name'},
	                     //{field: 'reviewer', displayName: 'Reviewer'},
					   //  {field: 'task', displayName: 'Review task'},
					     {field: 'complete', displayName: 'Completion', cellFilter:"percent:''", width:100},
					     {field: 'type', visible: false},
						{field: 'r360', visible: false}];

	$scope.gridReview = {
        data: 'reviewsAll',
        showGroupPanel: true,
        jqueryUIDraggable: true,
        multiSelect: false,
        filterOptions : $scope.filterOptions,
        columnDefs: $scope.columnDefs
	};

	$scope.reactivate = function(id){

	    var data = {
				id: id,
				command: 'reactivate'
				//status: 'PE'
			};

	    $http.post('/api/quarter/?json_data=true',data).success( function(data){
	        location.reload();
	    });
	};

	$scope.delete = function(id){

	    var data = {
				id: id,
				command: 'delete'
				//status: 'PE'
			};

	    $http.post('/api/quarter/?json_data=true',data).success( function(data){
	        location.reload();
	    });
	};
	$scope.restore = function(id){

	    var data = {
				id: id,
				command: 'restore'
				//status: 'PE'
			};

	    $http.post('/api/quarter/?json_data=true',data).success( function(data){
	        location.reload();
	    });
	};

	$scope.update_progress = function () {
		var total = 0, length;
		length = $scope.reviews.length;
		for(i in $scope.reviews) {
			total += $scope.reviews[i].complete;
		}
		if (length > 0) {
			total = Math.round(total / length);
		}
		if ($scope.current_due.id == $scope.show_due.id) {
			var data = {
				quarter: $scope.current_due.id,
				percent: total
			};
			$http.post('/performance/schedule/', data).success(function(data) {
				console.log(data);
			});
		}
		return total;
	};

	$scope.gridReviewNotStart = {
        data: 'reviewsNotStart',
        showGroupPanel: true,
        jqueryUIDraggable: true,
        multiSelect: false,
        filterOptions : $scope.filterOptions,
        columnDefs: $scope.columnDefs
	};

	$scope.gridReviewInprogress = {
        data: 'reviewsInprogress',
        showGroupPanel: true,
        jqueryUIDraggable: true,
        multiSelect: false,
        filterOptions : $scope.filterOptions,
        columnDefs: $scope.columnDefs
	};

	$scope.gridReviewComplete = {
	        data: 'reviewsComplete',
	        showGroupPanel: true,
	        jqueryUIDraggable: true,
	        multiSelect: false,
	        filterOptions : $scope.filterOptions,
	        columnDefs: $scope.columnDefs
		};

	$scope.initGrid = function(status) {
		if (status == 'not start') {
			return $filter('filter')(
				$scope.reviews,
				function(item) {
					if (item.complete == 0) {
						return true;
					}
					return false;
				});
		} else if (status == 'in progress') {
			return $filter('filter')(
				$scope.reviews,
				function(item) {
					if (item.complete > 0 && item.complete < 100) {
						return true;
					}
					return false;
				});
		}  else if (status == 'complete') {
			return $filter('filter')(
				$scope.reviews,
				function(item) {
					if (item.complete == 100) {
						return true;
					}
					return false;
				});
		}
	};

	$scope.filter_task = function () {
		var extra = '';
		var r360 = false, nr360 = false;
		var query = Array();
		if ($scope.manager) {
			query.push('manager');
			extra = "r360:0";
		}
		if ($scope.self) {
			query.push('self');
			extra = "r360:0";
		}

		if ($scope.review360) {
			query.push($scope.type_360);
			extra = "r360:1";
		}
		searchText = query.join("|");
		if (searchText != '') {
			searchText = 'type:' + searchText + ';';
		}
		searchText += extra;
		if ($scope.filterText && $scope.filterText != "") {
			searchText = $scope.filterText +";" + searchText;
		}
		$scope.filterOptions.filterText = searchText;
	};

	$scope.show_all = function () {
		$scope.filterText = "";
		$scope.filter_task();
	};

	$scope.change_due = function (due_date, quarter) {
		$("#id-edit_due_date").val(due_date);
		$('#id-old-due').val(due_date);
		$("#id_quarter_id").val(quarter);
		$("#id-save-edit-due").unbind('click');
		$("#id-save-edit-due").click(function () {
			$("#id-edit-due-form").submit();
		});
		$("#edit-schedule-modal").modal('show');
	};

	$scope.archive_review = function () {
		// if ($scope.dues.pending_due.length ==0) {
		// 	if(confirm("Vui lòng tạo lịch đánh giá mới trước khi lưu trữ. Bạn có muốn tạo lịch đánh giá ngay bây giờ không?")) {
		// 		$("#new-schedule-modal").modal();
		// 	}
		// 	return;
		// }
		$("#id-archive-btn").unbind('click');
		$("#id-archive-btn").click(function () {
			$("#id-archive-review-form").submit();
		});

		$("#archive-review-modal").modal();
	};

	$scope.get_schedule_review = function (due) {
		if ($scope.show_due != null && due == $scope.show_due.id) {
			return;
		}
		$('#loading').show();
		$scope.reviews = [];
		$scope.reviewsAll = [];
		$scope.reviewsNotStart = [];
		$scope.reviewsInprogress = [];
		$scope.reviewsComplete = [];
		$http.get('/performance/schedule/?json_data=true&quarter=' + due).success(
			function(data) {
				$scope.show_due = data[0].active_quarter;
				$scope.reviews = data[1];
				$scope.reviewsAll = data[1];
				$scope.reviewsNotStart = $scope.initGrid('not start');
				$scope.reviewsInprogress = $scope.initGrid('in progress');
				$scope.reviewsComplete = $scope.initGrid('complete');
				$('#loading').hide();
			}).error(function (data, status, headers) {
				$('#loading').hide();
				alert("Load data failed!");
			});
	};

	$scope.clear_select = function (id_tab) {
		$("#" + id_tab + " .schedule_left_item").removeClass("active");

		if (id_tab == "tab2") {
			$scope.get_schedule_review($scope.current_due.id);
			$("#tab1 .schedule_left_item:first").addClass("active");
		}
	};
}]);
