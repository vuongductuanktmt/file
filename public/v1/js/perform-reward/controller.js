
var base_sparkline_options={
			type:'line',//ok
	    	width:'100%',
	    	height:'40px',//ok
			lineColor:'green',//ok
			fillColor:false,//ok
			defaultPixelsPerValue:20,//applied when not set width
			highlightSpotColor:'#003464',//ok
			spotRadius:3,//bán kính của đốm tròn
			spotColor:false,
			minSpotColor:false,
			maxSpotColor:false,
			valueSpots:{'0:': '#31B0F1'},//ok
			tooltipChartTitle:'<i>Total Salary Budget</i>',
			tooltipPrefix:'tooltipPrefix',
			tooltipSuffix:'tooltipSuffix',
			tooltipFormat :
				'<div style="">\
					- Month: <span style="font-size:1.5em; font-weight:bold; color:yellow;">{{x}}</span><br> \
					- Budget: <span style="font-size:1.5em; font-weight:bold; color:yellow;"> {{y}}</span>\
				</div>',
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}
var param = getURLParameter('quarter_id') != null ? '?quarter_id=' +getURLParameter('quarter_id'): "";
var is_first_load=false;


//var peform_reward_app = angular.module('cloudjet', ['xeditable','ngMockE2E']);//REMOVE ngMockE2E IF DON'T TEST
var peform_reward_app = angular.module('cloudjet', ['xeditable']);

//http://stackoverflow.com/questions/17953938/declaring-controllers-in-angularjs
peform_reward_app.controller('perform_reward_controller', ['$scope', '$http','$q', '$timeout','$filter', function ($scope, $http, $q, $timeout, $filter) {
	
	
	$scope.allowed_edit=false;
	$scope.edited=false;
	$scope.unsaved=true;
	
	$scope.quarters_year='';
	$scope.quarters=[];
	
	$scope.api={};
	$scope.employees=[];
	$scope.reward_cap=0;
	
	$scope.reward_cap_amount=0;
	
	$scope.total_monthly_salary_budget=0;
	$scope.total_estimated_reward=0;
	//$scope.total_final_reward=0;
	$scope.max_rewarding=0;
	$scope.start_rewarding=0;
	$scope.end_rewarding=0;
	$scope.quarter_period=0;
	$scope.reward_over_ratio=0;
	
	$scope.unwatch_total_monthly_salary_budget=null;
	$scope.unwatch_reward_over_ratio=null;
	$scope.register_watch_total_monthly_salary_budget=null;
	$scope.register_watch_reward_over_ratio=null;
	
	$scope.get_total_final_reward=function(){
		var total_final_reward=0;
		for(var emp in $scope.employees){
			if($scope.employees[emp]['final_reward']){
				total_final_reward+=parseInt($scope.employees[emp]['final_reward']);
			}
			
		}
		return total_final_reward;
	}
	
	$scope.set_edit_flag=function(enable){
		if(enable){
			$scope.edited=true;
		}else{
			$scope.edited=false;
		}
		
	}
	$scope.set_allowed_edit_flag=function(enable){
		if(enable){
			$scope.allowed_edit=true;
		}else{
			$scope.allowed_edit=false;
		}
	}
	$scope.set_unsaved_flag=function(enable){
		if(enable){
			$scope.unsaved=true;
		}else{
			$scope.unsaved=false;
		}
	}
	/* calculating functions ************************************************************/
	$scope.calculate_total_monthly_salary_budget=function(){
		var total_monthly_salary_budget=0;
		for (var emp in $scope.employees){
			total_monthly_salary_budget+=$scope.employees[emp]['net_salary'];
		}
		$scope.total_monthly_salary_budget=total_monthly_salary_budget;
		//
		return total_monthly_salary_budget;
	}
	
	$scope.calculate_reward_cap=function(){//based on reward cap amount
		
		$scope.reward_cap=$scope.reward_cap_amount*100/$scope.total_monthly_salary_budget;
	}
	
	$scope.calculate_reward_cap_amount=function(){//based on reward cap
		$scope.reward_cap_amount = Math.round($scope.reward_cap*$scope.total_monthly_salary_budget/100);
		//$scope.reward_cap_amount=reward_cap_amount;
	}
	
	$scope.calculate_reward_over_ratio=function(){
		//return total_estimated_reward / $scope.reward_cap_amount
		var total_estimated_reward=0;
		for (var emp in $scope.employees){
			if(!$scope.employees[emp]['est_reward']){
				$scope.employees[emp]['est_reward']=0;
			}
			total_estimated_reward+=$scope.employees[emp]['est_reward'];
		}
		$scope.total_estimated_reward=total_estimated_reward;
		$scope.reward_over_ratio= $scope.reward_cap_amount? (total_estimated_reward / $scope.reward_cap_amount): 0;
		
	}
	
	$scope.calculate_final_rewards=function(){
		//$scope.reward_over_ratio
		for (var emp in $scope.employees){
			if(!$scope.employees[emp]['est_reward']){
				$scope.employees[emp]['est_reward']=0;
			}
			//total_estimated_reward+=$scope.employees[emp]['est_reward'];
			if($scope.reward_over_ratio<1){
				$scope.employees[emp]['final_reward']=$scope.employees[emp]['est_reward'];
			}else{
				$scope.employees[emp]['final_reward']=Math.round($scope.reward_over_ratio?$scope.employees[emp]['est_reward']/$scope.reward_over_ratio:0);
			}
			
		}
	}
	
	/* #end calculating functions ************************************************************/
	
	
	
	
	/* render charts *********************************************************/
	$scope.render_total_budget_chart=function(){
		var myvalues = [ [1,3], [2,6], [8,9], [11,12], [12,7] ];
		var overview_trend_chart_options=$.extend({}, base_sparkline_options);
		$('#total_budget_chart').sparkline(myvalues, overview_trend_chart_options);
	}
	$scope.render_reward_cap_chart=function(){
		var myvalues = [ [1,3], [2,6], [8,9], [11,12], [12,7] ];
		var overview_trend_chart_options=$.extend({}, base_sparkline_options);
		$('#reward_cap_chart').sparkline(myvalues, overview_trend_chart_options);
	}
	$scope.render_max_reward_chart=function(){
		var myvalues = [ [1,3], [2,6], [8,9], [11,12], [12,7] ];
		var overview_trend_chart_options=$.extend({}, base_sparkline_options);
		$('#max_reward_chart').sparkline(myvalues, overview_trend_chart_options);
	}
	/* #end render charts **************************************************/
	
	
	$scope.reset_global_setting=function(global_settings, employees){
		//refix employees data
		for(var emp in employees){
			if(employees[emp]['bind_global']==undefined){
				employees[emp]['bind_global']=1;
			}
		}
		$scope.employees= employees;
		$scope.settings = global_settings;
		
		if($scope.unwatch_total_monthly_salary_budget){
			$scope.unwatch_total_monthly_salary_budget();
			$scope.unwatch_total_monthly_salary_budget=null;
		}
		if($scope.unwatch_reward_over_ratio){
			$scope.unwatch_reward_over_ratio();
			$scope.unwatch_reward_over_ratio=null;
		}
		
		if(global_settings['allowed_edit']){
			$scope.allowed_edit=true;
		}else{
			$scope.allowed_edit=false;
		}
		$scope.edited=false;
		
		if(global_settings['unsaved']){
			$scope.unsaved=true;
		}else{
			$scope.unsaved=false;
		}
		
		
		$scope.reward_cap=$scope.settings['reward_cap'];
		$scope.max_rewarding=$scope.settings['max_rewarding'];
		$scope.start_rewarding=$scope.settings['start_rewarding'];
		$scope.end_rewarding=$scope.settings['end_rewarding'];
		$scope.quarter_period=$scope.settings['quarter_period'];
		
		$scope.calculate_total_monthly_salary_budget();
		$scope.calculate_reward_cap_amount();
		$scope.calculate_reward_over_ratio();
		
		if($scope.unsaved){
			$scope.calculate_final_rewards();
		}
	}
	
	$scope.validate_export_excel=function($event){//jquery event
		
		if($scope.unsaved){
			console.log('check form submit');
			//$($event.currentTarget).children('[ng-popover]').popover('show');
			//cancel form submit
			$event.preventDefault();
			return false;
		}else{
			$($event.currentTarget).children('[ng-popover]').popover('hide');
		}
		
	}
	
	$scope.link_status=function(){
		var has_link=false, has_unlink=false;
		for (var i in $scope.employees){
			if(parseInt($scope.employees[i]['bind_global'])==0){
				has_unlink=true;
			}else{
				has_link=true;
			}
			if(has_link && has_unlink){
				break;
			}
		}
		
		if(has_unlink && !has_link){
			return 'unlink';
		}else if(!has_unlink&&has_link){
			return 'link';
		}else{
			return 'partial-link';
		}
	}
	$scope.save_changes=function(){
		if($scope.allowed_edit && ($scope.edited||$scope.unsaved)){
			//do save changes of employee final rewards
			$scope.allowed_edit=false;
			$scope.edited=false;
			$('#box-notification').html('Saving...').fadeIn();
			$http.post('/performance/api/perform-reward/', {employees: angular.toJson($scope.employees), action:'save_final_rewards'})
//			$http.post('/performance/api/perform-reward/', {employees: $scope.employees, action:'save_final_rewards'})
			  .success(function(res) {
				  res = res || {};
				  if(res.status === 'ok') { // {status: "ok"}
					  $scope.reset_global_setting(res.quarter_period, res.employees);
					  console.log('saved successful!');
					  $('#box-notification').html('Successful!');
					  
					  $timeout(function(){$('#box-notification').fadeOut();}, 1000);
					  //$scope.allowed_edit=true;
					  
				  } else { // {status: "error", msg: "Username should be `awesome`!"}
					  console.log(res.msg);
					  $('#box-notification').html('<span class="text-warning">'+res.msg+'</span>');
				  }
			  })
			  .error(function(e){
				  console.log('Server error!');
				  $('#box-notification').html('<span class="text-warning">Sorry, server error!<br>Try reload page!</span>');
				  
				  $scope.allowed_edit=false;
				  $scope.edited=false;
			  });
		}
	}
	
	
	/* get data first load ****************************************************/
	$http.get("/performance/api/perform-reward/" + param).then(function (response) {//success  +location.search
		
		$scope.api = response.data;
		$scope.quarters_year=response.data[0]['quarters_year'];
		$scope.quarters=response.data[0]['quarters'];
		$scope.reset_global_setting(response.data[0], response.data[1]);
		
		$('#quarter-datepicker').datepicker('setDate', new Date(parseInt(response.data[0]['quarters_year']),10,16));
		
		console.log(response.data);
		
	}, function () {
		// error
		alert("Could not load api data");
	});
	/* #end get data first load ****************************************************/
	
	$scope.is_active_quarter = function (quarter) {
		if (quarter.quarter_id == $scope.settings.quarter_period) {
			return true;
		}
		return false;
	}
	
	/* watch functions ***********************************************************/
	var watch_total_monthly_salary_budget = function (newValue, oldValue) {
		
		if(newValue!=oldValue){
			$scope.calculate_reward_cap_amount();
			//#$scope.calculate_reward_over_ratio();
			
			$scope.render_total_budget_chart();
			$scope.render_reward_cap_chart();
		}
		
	}
	var watch_reward_over_ratio= function (newValue, oldValue) {
		//calculate all employees final reward
		if(newValue!=oldValue){
			$scope.calculate_final_rewards();
		}
		
	}

	
	$scope.register_watch_total_monthly_salary_budget=function(){
		$scope.unwatch_total_monthly_salary_budget=$scope.$watch('total_monthly_salary_budget', watch_total_monthly_salary_budget);
	}
	$scope.register_watch_reward_over_ratio=function(){
		$scope.unwatch_reward_over_ratio = $scope.$watch('reward_over_ratio', watch_reward_over_ratio);
	}
	
	
	/* #end watch functions ***********************************************************/
	
	$scope.validateGlobalField = function(data, field) {
		  var d = $q.defer();
		  if($scope.allowed_edit){
			  $scope.edited=true;
			  $scope.allowed_edit=false;
			  $http.post('/performance/api/perform-reward/', {value: data, field:field, action:'update_global_field'})
			  .success(function(res) {
				  res = res || {};
				  if(res.status === 'ok') { // {status: "ok"}
					  $scope.reset_global_setting(res.quarter_period, res.employees);
					  d.resolve(false);//#http://vitalets.github.io/angular-xeditable/#onbeforesave
					  
//					  if(res.employees){
//						  $scope.employees=res.employees;
//					  }	
//					  if(_field=='reward_cap'||_field=='reward_cap_amount'){
//						  
//						  $scope.calculate_total_monthly_salary_budget();
//						  $scope.reward_cap=res.quarter_period.reward_cap;
//						  $scope.calculate_reward_cap_amount();
//						  $scope.calculate_reward_over_ratio();
//						  
//						  $scope.render_reward_cap_chart();
//						  
//						  d.resolve(false);//#http://vitalets.github.io/angular-xeditable/#onbeforesave
//					  }else{
//						  d.resolve();
//					  }
					  
					  
				  } else { // {status: "error", msg: "Username should be `awesome`!"}
					  d.resolve(res.msg);
				  }
				  $scope.allowed_edit=true;
			  })
			  .error(function(e){
				  d.reject('Server error!');
				  $scope.allowed_edit=true;
			  });
		  }else{
			  d.reject('Edit not allowed!');
			  $scope.allowed_edit=false;
		  }
		  
		  return d.promise;
	};
	
	
	
	/* format functions ******************************************************/
	$scope.format_ratio=function(ratio){
		return Number(ratio).format(2);
	}
	$scope.format_money = function (amount) {
		
		return '$'+Number(amount).format(0);
	};
	
	$scope.format_percent = function (n, x) {
		
		return Number(n).format(x) + '%';
	};
	/* #end format functions ******************************************************/
}]);



peform_reward_app.run(function(editableOptions) {
	  editableOptions.theme = 'bs2'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

peform_reward_app.controller('employeeController',['$scope','$log', '$q','$http', '$filter', function ($scope, $log, $q, $http, $filter) {
		$scope.bind_global_statuses=[
		                             {value: 1, text:'Yes', 'class': 'fa-link fa-bind-global'},
		                             {value: 0, text:'No', 'class': 'fa-chain-broken fa-bind-global'}
		                           ]; 
		
		$scope.showUnBindGlobalStatus = function(emp) {
		    var selected = $filter('filter')($scope.bind_global_statuses, {value: emp.bind_global});
		    return (selected.length) ? selected[0]['class'] : 'fa-chain-broken';
		 };
		 
		$scope.check_enable_bind_global=function(index){
			if(parseInt($scope.employees[index]['bind_global'])!=0){
				return true;
			}else{
				return false;
			}
		}
		 
		$scope.emp_change=0;
		$scope.unwatch_emp_change=null;
		$scope.register_watch_emp_change=null;
		
		$scope.unwatch_est_reward=null;
		$scope.register_watch_est_reward=null;
		var watch_est_reward =function(newValue, oldValue){
			console.log('watch_est_reward');
			if(newValue!=oldValue){
//				  $scope.calculate_total_monthly_salary_budget();
//				  $scope.calculate_reward_cap_amount();
//				  $scope.calculate_reward_over_ratio();
			  }
		}
		$scope.register_watch_est_reward=function(){
			$scope.unwatch_est_reward=$scope.$watch('emp.est_reward', watch_est_reward);//will remove when re-load employees data
		}
		
		
		var watch_emp_change=function(newValue, oldValue){
			console.log('watch_emp_change');
			if(newValue!=oldValue){
				
				  $scope.calculate_total_monthly_salary_budget();
				  $scope.calculate_reward_cap_amount();
				  $scope.calculate_reward_over_ratio();
			  }
		}
		$scope.register_watch_emp_change=function(){
			$scope.unwatch_emp_change=$scope.$watch('emp_change', watch_emp_change);//will remove when re-load employees data
		}
		
		
		
	  //ok
	  $scope.validateEmpField = function(data, field, index) {
		  var d = $q.defer();
		    $scope.employees[index]
		  if($scope.allowed_edit && (parseInt($scope.employees[index]['bind_global'])==0 || field=='bind_global' || field=='net_salary')){
			  
			  
			  $scope.set_edit_flag(true);
			  $scope.set_allowed_edit_flag(false);
			  
			  if(!$scope.unwatch_total_monthly_salary_budget){
					$scope.register_watch_total_monthly_salary_budget();
				}
				if(!$scope.unwatch_reward_over_ratio){
					$scope.register_watch_reward_over_ratio();
				}
				  
				  
//				  if (!$scope.unwatch_est_reward){
//					  $scope.register_watch_est_reward();
//				  }
				if (!$scope.unwatch_emp_change){
					  $scope.register_watch_emp_change();
				  }
			    
		    	$http.post('/performance/api/perform-reward/', {value: data, field:field, employee_id:$scope.employees[index]['_id']['$oid'], action:'update_employee_field'})
		    	.success(function(res) {
			      res = res || {};
			      if(res.status === 'ok') { // {status: "ok"}
//			    	  emp.est_reward =  res.emp.est_reward;
//			    	  emp.bind_global=res.emp.bind_global;
			    	  var fixed_emp={ 'final_reward':$scope.employees[index]['final_reward']}
			    	  $.extend($scope.employees[index], res.emp, fixed_emp);
			    	  
//			    	  $scope.employees[index]['est_reward']=parseInt(res.emp.est_reward);
//			    	  $scope.employees[index]['bind_global']=parseInt(res.emp.bind_global);
			    	  
			    	  $scope.set_unsaved_flag(true);
			    	  $scope.emp_change++;//notify to watch function
			    	  
			    	  //$scope.$apply();//error: http://stackoverflow.com/questions/22733422/angularjs-rootscopeinprog-inprogress-error
			    	  
			    	  if(field != 'net_salary'){
			    		  //#$scope.calculate_reward_over_ratio();
			    	  }else{
			    		 //$scope.calculate_total_monthly_salary_budget();
			    		  //--> total_monthly_salary_budget will caculate later on View, then watch of total_monthly_salary_budget is triggered #required: call calculate_total_monthly_salary_budget() in HTML
			    	  }
			    	  
			        d.resolve()
			      } else { // {status: "error", msg: "Username should be `awesome`!"}
			        d.resolve(res.msg)
			      }
			      
			      $scope.set_allowed_edit_flag(true);
			    })
			    .error(function(e){
			      d.reject('Server error!');
			      $scope.set_allowed_edit_flag(false);
			    });
			  
		  }else{
			  d.reject('Edit not allowed!');
		  }
		
	    return d.promise;
	  };
	  
}]);


/******REMOVE CODE BELOW IF DON'T TEST*****/
/*
//mock ajax requests
peform_reward_app.run(function($httpBackend) {
  $httpBackend.whenGET('/groups').respond([
    {id: 1, text: 'user'},
    {id: 2, text: 'customer'},
    {id: 3, text: 'vip'},
    {id: 4, text: 'admin'}
  ]);
  $httpBackend.whenPOST('/validateField/').respond([
                                           {status: "ok"}
                                           ]);
//ref: http://stackoverflow.com/questions/21057477/how-to-return-a-file-content-from-angulars-httpbackend
  $httpBackend.whenGET('/performance/api/perform-reward/').respond(function(method, url, data){
	  var request = new XMLHttpRequest();

	  //request.open('GET', '/static/v1/js/perform-reward/data.js', false);//get static file data
	  request.open('GET', '/performance/api/perform-reward/', false);
	  request.send(null);

	  return [request.status, request.response, {}];
  });
  
//  $httpBackend.whenGET('/performance/api/perform-reward/').respond(
//		  [{"end_rewarding": null, "start_rewarding": null, "reward_cap": null, "quarter_period": 29, "max_rewarding": null}, [{"potential_score_manger": 0.0, "created_at": {"$date": 1433263818283}, "grid_position": "", "user_id": 8, "quarter_period": 29, "employee_code": "AV060112.002", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Cam Buon", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5a8dc10915c8f87c41"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263819834}, "grid_position": "", "user_id": 99, "quarter_period": 29, "employee_code": "122", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Doan Hong Phi", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5b8dc10915c8f87c46"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"created_at": {"$date": 1433263821892}, "grid_position": "", "user_id": 100, "quarter_period": 29, "employee_code": "9", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "John Snow", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5d8dc10915c8f87c52"}, "potential_score_self": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263821206}, "grid_position": "", "user_id": 101, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Hillary Vu", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5d8dc10915c8f87c4f"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263826218}, "grid_position": "", "user_id": 102, "quarter_period": 29, "employee_code": "001", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Tyrion Lannister", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c628dc10915c8f87c76"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263824326}, "grid_position": "", "user_id": 103, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Robber Stark", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c68"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263821537}, "grid_position": "", "user_id": 104, "quarter_period": 29, "employee_code": "02", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "IT  Mo Minh Directors", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5d8dc10915c8f87c51"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263821446}, "grid_position": "", "user_id": 106, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "Robber Stark", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "H\u00f4\u0300ng Lan", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5d8dc10915c8f87c50"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263822204}, "grid_position": "", "user_id": 107, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Kim Ph\u01b0\u01a1ng", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c56"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263825567}, "grid_position": "", "user_id": 108, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "Robber Stark", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Tr\u00e2\u0300n C\u00f4ng", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c618dc10915c8f87c73"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263823459}, "grid_position": "", "user_id": 110, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "02", "confirmed_kpi": 0, "manager_name": "IT  Mo Minh Directors", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "L\u00ea Huy\u0300nh", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5f8dc10915c8f87c60"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263822556}, "grid_position": "", "user_id": 112, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "AV060112.002", "confirmed_kpi": 0, "manager_name": "Cam Buon", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Le Lam", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c59"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263826817}, "grid_position": "", "user_id": 113, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "Robber Stark", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "\u0110\u00f4\u0300ng Thi\u0323 Thanh", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c628dc10915c8f87c7b"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263820963}, "grid_position": "", "user_id": 114, "quarter_period": 29, "employee_code": "04", "potential_score": 0.0, "manager_code": "001", "confirmed_kpi": 0, "manager_name": "Tyrion Lannister", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Ha\u0300 Trung Si\u0301nh", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5c8dc10915c8f87c4d"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263826487}, "grid_position": "", "user_id": 119, "quarter_period": 29, "employee_code": "2", "potential_score": 0.0, "manager_code": "K019", "confirmed_kpi": 0, "manager_name": "SSS DDD", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "tes test", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c628dc10915c8f87c78"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263824550}, "grid_position": "", "user_id": 120, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "TRUONG HA NAM", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c6a"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263820717}, "grid_position": "", "user_id": 122, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "TRUONG HA NAM", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Ha Nam", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5c8dc10915c8f87c4b"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263824864}, "grid_position": "", "user_id": 124, "quarter_period": 29, "employee_code": "BV060105.018", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "L\u00ea Huy\u0300nh", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Thai Chi", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c6c"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263820105}, "grid_position": "", "user_id": 125, "quarter_period": 29, "employee_code": "BV060103.007", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "L\u00ea Huy\u0300nh", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Duong Cong", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5c8dc10915c8f87c47"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263824770}, "grid_position": "", "user_id": 126, "quarter_period": 29, "employee_code": "AV060112.195", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "L\u00ea Huy\u0300nh", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Ta Hue", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c6b"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263823750}, "grid_position": "", "user_id": 127, "quarter_period": 29, "employee_code": "AV060112.242", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "L\u00ea Huy\u0300nh", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Minh Duong", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5f8dc10915c8f87c61"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263823360}, "grid_position": "", "user_id": 128, "quarter_period": 29, "employee_code": "BV060110.057", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "L\u00ea Huy\u0300nh", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Luu Ha", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5f8dc10915c8f87c5f"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263824051}, "grid_position": "", "user_id": 129, "quarter_period": 29, "employee_code": "AV060112.300", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "L\u00ea Huy\u0300nh", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Minh Quy", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c63"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263820615}, "grid_position": "", "user_id": 130, "quarter_period": 29, "employee_code": "AV060112.194", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "L\u00ea Huy\u0300nh", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Ha Long", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5c8dc10915c8f87c4a"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263820322}, "grid_position": "", "user_id": 131, "quarter_period": 29, "employee_code": "BV060111.109", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "L\u00ea Huy\u0300nh", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Duong Thuy", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5c8dc10915c8f87c48"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263826722}, "grid_position": "", "user_id": 132, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "trang thi hoa", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c628dc10915c8f87c79"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263825034}, "grid_position": "", "user_id": 133, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Tieu ngo", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c618dc10915c8f87c6e"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263825957}, "grid_position": "", "user_id": 134, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Tuong Ma", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c618dc10915c8f87c75"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263825480}, "grid_position": "", "user_id": 135, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "001", "confirmed_kpi": 0, "manager_name": "Tyrion Lannister", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Trung Thanh", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c618dc10915c8f87c71"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263822364}, "grid_position": "", "user_id": 136, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "001", "confirmed_kpi": 0, "manager_name": "Tyrion Lannister", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Le Ha\u0300 Duong", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c57"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263825277}, "grid_position": "", "user_id": 139, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Tin", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c618dc10915c8f87c6f"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"created_at": {"$date": 1433263825498}, "grid_position": "", "user_id": 143, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Truong Ha Nam", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c618dc10915c8f87c72"}, "potential_score_self": 0.0}, {"created_at": {"$date": 1433263826741}, "grid_position": "", "user_id": 150, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "\u0110o\u00e0n H\u1ed3ng Phi", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c628dc10915c8f87c7a"}, "potential_score_self": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263822987}, "grid_position": "", "user_id": 435, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Le Thanh Minh", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c5d"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263822704}, "grid_position": "", "user_id": 440, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "TRUONG HA NAM", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Le Minh", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c5b"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263818686}, "grid_position": "", "user_id": 441, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "TRUONG HA NAM", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Cam Tu", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5a8dc10915c8f87c43"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263823017}, "grid_position": "", "user_id": 442, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "Cam Tu", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Le Thi Cat", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5f8dc10915c8f87c5e"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263818509}, "grid_position": "", "user_id": 443, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "TRUONG HA NAM", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Cam Huong", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5a8dc10915c8f87c42"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"created_at": {"$date": 1433263820344}, "grid_position": "", "user_id": 444, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Ha Huy Tap", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5c8dc10915c8f87c49"}, "potential_score_self": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263822764}, "grid_position": "", "user_id": 450, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Le Minh Toan", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c5c"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263825821}, "grid_position": "", "user_id": 451, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Tung Lan", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c618dc10915c8f87c74"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"created_at": {"$date": 1433263820990}, "grid_position": "", "user_id": 455, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Hello World", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5c8dc10915c8f87c4e"}, "potential_score_self": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263822648}, "grid_position": "", "user_id": 459, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "Le Lam", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Le MInh", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c5a"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263823800}, "grid_position": "", "user_id": 461, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "Le Lam", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Minh Mang", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5f8dc10915c8f87c62"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263824892}, "grid_position": "", "user_id": 462, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "Le Lam", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Thanh Thai", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c6d"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"created_at": {"$date": 1433263822029}, "grid_position": "", "user_id": 509, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Kim Joho ", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c55"}, "potential_score_self": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263820857}, "grid_position": "", "user_id": 649, "quarter_period": 29, "employee_code": "K018", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Ha Trung", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5c8dc10915c8f87c4c"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"created_at": {"$date": 1433263825294}, "grid_position": "", "user_id": 656, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Toan Th\u1eafng", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c618dc10915c8f87c70"}, "potential_score_self": 0.0}, {"created_at": {"$date": 1433263824125}, "grid_position": "", "user_id": 657, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Phi doan", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c66"}, "potential_score_self": 0.0}, {"created_at": {"$date": 1433263824168}, "grid_position": "", "user_id": 658, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "", "confirmed_kpi": 0, "manager_name": "", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Phi doan", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c67"}, "potential_score_self": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263824433}, "grid_position": "", "user_id": 661, "quarter_period": 29, "employee_code": "K019", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "SSS DDD", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c69"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263821950}, "grid_position": "", "user_id": 664, "quarter_period": 29, "employee_code": "001", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Kham Pha", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5d8dc10915c8f87c53"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263822008}, "grid_position": "", "user_id": 665, "quarter_period": 29, "employee_code": "001", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Kham Pha1", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c54"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263826249}, "grid_position": "", "user_id": 666, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "XXXX", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c628dc10915c8f87c77"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263824083}, "grid_position": "", "user_id": 668, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Nguyen Van A", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c64"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263819326}, "grid_position": "", "user_id": 669, "quarter_period": 29, "employee_code": "", "potential_score": 0.0, "manager_code": "9", "confirmed_kpi": 0, "manager_name": "John Snow", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Doan", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5b8dc10915c8f87c45"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263824109}, "grid_position": "", "user_id": 670, "quarter_period": 29, "employee_code": "T009", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Pham Tu", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c608dc10915c8f87c65"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263822390}, "grid_position": "", "user_id": 671, "quarter_period": 29, "employee_code": "T009", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Le Khai Minh", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5e8dc10915c8f87c58"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263817391}, "grid_position": "", "user_id": 672, "quarter_period": 29, "employee_code": "T009", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "ABC", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c598dc10915c8f87c3f"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263817673}, "grid_position": "", "user_id": 673, "quarter_period": 29, "employee_code": "T009", "potential_score": 0.0, "manager_code": "122", "confirmed_kpi": 0, "manager_name": "Doan Hong Phi", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "CBG", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c598dc10915c8f87c40"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}, {"potential_score_manger": 0.0, "created_at": {"$date": 1433263818714}, "grid_position": "", "user_id": 686, "quarter_period": 29, "employee_code": "001", "potential_score": 0.0, "manager_code": "001", "confirmed_kpi": 0, "manager_name": "Tyrion Lannister", "kpi_percent": 0.0, "total_kpi": 0, "kpi_percent_self": 0.0, "employee_name": "Do Loan", "net_salary": 0, "organization": 1, "_id": {"$oid": "556d7c5a8dc10915c8f87c44"}, "potential_score_self": 0.0, "kpi_percent_manager": 0.0}]]
//  );
});
*/

