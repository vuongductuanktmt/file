/*! jquery-dateFormat 18-05-2015 */
var DateFormat={};!function(a){var b=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],c=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],d=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],e=["January","February","March","April","May","June","July","August","September","October","November","December"],f={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"},g=/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/;a.format=function(){function a(a){return b[parseInt(a,10)]||a}function h(a){return c[parseInt(a,10)]||a}function i(a){var b=parseInt(a,10)-1;return d[b]||a}function j(a){var b=parseInt(a,10)-1;return e[b]||a}function k(a){return f[a]||a}function l(a){var b,c,d,e,f,g=a,h="";return-1!==g.indexOf(".")&&(e=g.split("."),g=e[0],h=e[e.length-1]),f=g.split(":"),3===f.length?(b=f[0],c=f[1],d=f[2].replace(/\s.+/,"").replace(/[a-z]/gi,""),g=g.replace(/\s.+/,"").replace(/[a-z]/gi,""),{time:g,hour:b,minute:c,second:d,millis:h}):{time:"",hour:"",minute:"",second:"",millis:""}}function m(a,b){for(var c=b-String(a).length,d=0;c>d;d++)a="0"+a;return a}return{parseDate:function(a){var b,c,d={date:null,year:null,month:null,dayOfMonth:null,dayOfWeek:null,time:null};if("number"==typeof a)return this.parseDate(new Date(a));if("function"==typeof a.getFullYear)d.year=String(a.getFullYear()),d.month=String(a.getMonth()+1),d.dayOfMonth=String(a.getDate()),d.time=l(a.toTimeString()+"."+a.getMilliseconds());else if(-1!=a.search(g))b=a.split(/[T\+-]/),d.year=b[0],d.month=b[1],d.dayOfMonth=b[2],d.time=l(b[3].split(".")[0]);else switch(b=a.split(" "),6===b.length&&isNaN(b[5])&&(b[b.length]="()"),b.length){case 6:d.year=b[5],d.month=k(b[1]),d.dayOfMonth=b[2],d.time=l(b[3]);break;case 2:c=b[0].split("-"),d.year=c[0],d.month=c[1],d.dayOfMonth=c[2],d.time=l(b[1]);break;case 7:case 9:case 10:d.year=b[3],d.month=k(b[1]),d.dayOfMonth=b[2],d.time=l(b[4]);break;case 1:c=b[0].split(""),d.year=c[0]+c[1]+c[2]+c[3],d.month=c[5]+c[6],d.dayOfMonth=c[8]+c[9],d.time=l(c[13]+c[14]+c[15]+c[16]+c[17]+c[18]+c[19]+c[20]);break;default:return null}return d.date=d.time?new Date(d.year,d.month-1,d.dayOfMonth,d.time.hour,d.time.minute,d.time.second,d.time.millis):new Date(d.year,d.month-1,d.dayOfMonth),d.dayOfWeek=String(d.date.getDay()),d},date:function(b,c){try{var d=this.parseDate(b);if(null===d)return b;for(var e,f=d.year,g=d.month,k=d.dayOfMonth,l=d.dayOfWeek,n=d.time,o="",p="",q="",r=!1,s=0;s<c.length;s++){var t=c.charAt(s),u=c.charAt(s+1);if(r)"'"==t?(p+=""===o?"'":o,o="",r=!1):o+=t;else switch(o+=t,q="",o){case"ddd":p+=a(l),o="";break;case"dd":if("d"===u)break;p+=m(k,2),o="";break;case"d":if("d"===u)break;p+=parseInt(k,10),o="";break;case"D":k=1==k||21==k||31==k?parseInt(k,10)+"st":2==k||22==k?parseInt(k,10)+"nd":3==k||23==k?parseInt(k,10)+"rd":parseInt(k,10)+"th",p+=k,o="";break;case"MMMM":p+=j(g),o="";break;case"MMM":if("M"===u)break;p+=i(g),o="";break;case"MM":if("M"===u)break;p+=m(g,2),o="";break;case"M":if("M"===u)break;p+=parseInt(g,10),o="";break;case"y":case"yyy":if("y"===u)break;p+=o,o="";break;case"yy":if("y"===u)break;p+=String(f).slice(-2),o="";break;case"yyyy":p+=f,o="";break;case"HH":p+=m(n.hour,2),o="";break;case"H":if("H"===u)break;p+=parseInt(n.hour,10),o="";break;case"hh":e=0===parseInt(n.hour,10)?12:n.hour<13?n.hour:n.hour-12,p+=m(e,2),o="";break;case"h":if("h"===u)break;e=0===parseInt(n.hour,10)?12:n.hour<13?n.hour:n.hour-12,p+=parseInt(e,10),o="";break;case"mm":p+=m(n.minute,2),o="";break;case"m":if("m"===u)break;p+=n.minute,o="";break;case"ss":p+=m(n.second.substring(0,2),2),o="";break;case"s":if("s"===u)break;p+=n.second,o="";break;case"S":case"SS":if("S"===u)break;p+=o,o="";break;case"SSS":var v="000"+n.millis.substring(0,3);p+=v.substring(v.length-3),o="";break;case"a":p+=n.hour>=12?"PM":"AM",o="";break;case"p":p+=n.hour>=12?"p.m.":"a.m.",o="";break;case"E":p+=h(l),o="";break;case"'":o="",r=!0;break;default:p+=t,o=""}}return p+=q}catch(w){return console&&console.log&&console.log(w),b}},prettyDate:function(a){var b,c,d;return("string"==typeof a||"number"==typeof a)&&(b=new Date(a)),"object"==typeof a&&(b=new Date(a.toString())),c=((new Date).getTime()-b.getTime())/1e3,d=Math.floor(c/86400),isNaN(d)||0>d?void 0:60>c?"just now":120>c?"1 minute ago":3600>c?Math.floor(c/60)+" minutes ago":7200>c?"1 hour ago":86400>c?Math.floor(c/3600)+" hours ago":1===d?"Yesterday":7>d?d+" days ago":31>d?Math.ceil(d/7)+" weeks ago":d>=31?"more than 5 weeks ago":void 0},toBrowserTimeZone:function(a,b){return this.date(new Date(a),b||"MM/dd/yyyy HH:mm:ss")}}}()}(DateFormat),function(a){a.format=DateFormat.format}(jQuery);
!function(){"use strict";var n=angular.module("simplePagination",[]);n.factory("Pagination",function(){var n={};return n.getNew=function(n){n=void 0===n?5:n;var e={numPages:1,perPage:n,page:0};return e.prevPage=function(){e.page>0&&(e.page-=1)},e.nextPage=function(){e.page<e.numPages-1&&(e.page+=1)},e.toPageId=function(n){n>=0&&n<=e.numPages-1&&(e.page=n)},e},n}),n.filter("startFrom",function(){return function(n,e){return void 0===n?n:n.slice(+e)}}),n.filter("range",function(){return function(n,e){e=parseInt(e);for(var t=0;e>t;t++)n.push(t);return n}})}();

var cjs = angular.module('cloudjet', ['simplePagination']);

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return "ga_" + text;
}

function isEmpty(val) {
	if (val == null) {
		return true;
	}
	val = val.toString();
	if (val == '' || val == null) {
		return true;
	}
	return false;
}

function score_to_percent(score) {
    if (score == null) {
    	return 0;
    }   

    percent_100 = 2.0 / 3 * 100;
    if (score <= percent_100) {
    	return (score * 100 / (2.0 / 3 * 100)).toFixed(1);
    } else {
    	return (100 + (score - percent_100) * 20 / (1.0 / 3 * 100)).toFixed(1);
    }
}

function deleted___kpi_score_calculator(operator, target, real) {
	if (operator == ">=") {
		if (target == 0) {
			if (target == real) {
				score = 2.0 / 3 * 100;
			} else if (real < 0){
				score = 0.001;
			} else {
				score = 120;
			}					
		} else if (target != 0) {
			if (real <= target) {
				score = real / target * 2.0 / 3 * 100;
				if (score == 0) {
					score = 0.001;
				}
			} else {
				score = 2.0/3 * 100 + (real - target) / target * 1.0 / 3 * 100 / 0.2;
			}
		}
	} else if (operator == "<=") {
		if (target == 0) {
			if (real == 0) {
				score = 2.0/3* 100;
			} else if (real < 0) {
				score = 100;
			} else {
				score = (100 - real / 5 * 100) * 2.0 / 3;
				if (score <= 0) {
					score = 0.001;
				}
			}
		} else if (target != 0) {
			score = 100 + (target - real) / target * 100;
			if (score <= 0) {
				score = 0.001;
			} else if (score <= 100) {
				score = score * 2.0 / 3 ;
			} else if (score > 100) {
				if (score > 120) {
					score = 100;
				} else {
					score = 2.0/ 3 * 100 + (score - 100) * (1.0 / 3 * 100) / 20;
				}
			}
		}
	} else {
		if (real == target) {
			score = 2.0 / 3 * 100;
		} else {
			score = 0.001;
		}
	}
	return score;
}

function show_percent(val) {
	if (val == null) {
		return 'N/A';
	}
	percent_100 = 2.0/3 * 100;
	if (val <= percent_100) {
		return (val * 100 / (2.0 / 3 * 100)).toFixed(1) + "%";
	} else {
		return (100 + (val - percent_100) * 20 / (1.0 / 3 * 100)).toFixed(1) + "%";
	}
}

cjs.controller('KpiReviewController', ['$scope', '$http', 'Pagination', function($scope, $http, Pagination) {
	$scope.operators = ['>=', "<=", '='];
	$scope.data_kpi = [];
	$scope.pagination = Pagination.getNew(15);

	   $scope.change_score_calculation_type = function (kpi) {


        switch (kpi.score_calculation_type) {
            case 'sum':
                kpi.score_calculation_type = 'average';
                kpi.real = $scope.average;

                break;
            case 'average':
                kpi.score_calculation_type = 'most_recent';
              //  kpi.score_calculation_type = 'sum';
                kpi.real = $scope.latest_result;
                break;
            case 'most_recent':
                kpi.score_calculation_type = '';
                break;
            default :
                kpi.score_calculation_type = 'sum';
                kpi.real = $scope.sum;
                break;
        }

        $scope.calculate_score(kpi);
    };



	$scope.get_kpi = function(){
	    //alert(kpi_id);

	    $http.get("/api/kpi/?kpi_id=" + kpi_id ).success( function(response){
	        $scope.kpi = response;

	    });
	}
	$scope.get_kpi();



	$scope.get_data = function(){

	
	    $http.get(location.href + "?json=true&" + makeid()).success(
			function(response) {
				$scope.data_kpi = response
				$scope.pagination.numPages = Math.ceil(response.sub_kpis.length/$scope.pagination.perPage);
				$scope.draw_chart();

				$scope.sum = 0;
				$scope.average = 0;
				$scope.latest_result = 0;

				var i = 0;

				$scope.data_kpi.sub_kpis.forEach(function( element){
				    $scope.sum += element.real;
				    $scope.latest_result = element.real;
				    i += 1;
				    //alert(element.real)

				});
				$scope.average = $scope.sum/i;

			}).error(function(data, status, headers, config) {
				$('#loading').hide();
				$('#ballsWaveG').fadeOut();
				alert("Load data failed!");
			});

	}

	$scope.get_data();
	$scope.show_score = function (kpi) {
		return show_percent(kpi.score);
	};
	
	$scope.get_in_charge = function (kpi) {
		if (kpi.assigend_to){
			return kpi.assigend_to;
		}
		return kpi.display_name;
	}
	
	$scope.draw_chart = function () {
		var data = [];
		if ($scope.data_kpi) {
			for(i in $scope.data_kpi.sub_kpis) {
				obj = $scope.data_kpi.sub_kpis[i];

				date_obj = new Date(obj.review_date.$date);
				data.push([new Date(date_obj.getFullYear(), date_obj.getMonth(), date_obj.getDate()), obj.real]);
			}
		}
		chart_data = data;
		drawChart();
	}
	
	$scope.show_percent_final = function (score) {
		return show_percent(score);
	};
	
	$scope.remove_kpi = function (kpi) {
		if (!confirm("Are you sure?")) {
			return;
		}
		var data = {
			'id': kpi._id.$oid
		};
		$http.post(location.href + "delete/", data).success(function(data) {
			var index = $scope.data_kpi.sub_kpis.indexOf(kpi);
			if (index != -1) {
				$scope.data_kpi.sub_kpis.splice(index, 1);
				if(!$scope.$$phase) {
					$scope.$apply();
				}
				$scope.draw_chart();
			}		
		}).error(function(data, status, headers, config) {
			alert("Something wrong. Please try again.");
		});
	};
	
	$scope.reset_form = function () {
		$scope.review_date = $.format.date(new Date(), "dd-MM-yyyy");
		$scope.note = null;
	};
	$scope.add_kpi = function () {
		var data = {
			review_date: $scope.review_date,
			note:$scope.note,
			real: $scope.real
		};
		
		cloudjetRequest.ajax({
	        type: 'POST',
	        data: data,        			        
	        url: location.href + "add/",
	        beforeSend: function () {
	        	$("#id_kpi_saving").show();
	        	$("#btn-add-kpi").enable(false);
	        },
	        success:function(data) {
	        	if (typeof data == 'object') {
	        		$scope.data_kpi.sub_kpis.push(data);
	        		$scope.get_data();
	        		if(!$scope.$$phase) {
						$scope.$apply();
					}
	        		$scope.draw_chart();
	        		$('#add-kpi-modal').modal('hide');
	        		$scope.reset_form();
	        	} else {
	        		
	        	}
	        	$("#id_kpi_saving").hide();
	        	$("#btn-add-kpi").enable(true);
	        },
	        error:function(jqXHR, textStatus, errorThrown) {	
	        	$("#id_kpi_saving").hide();
	        	$("#btn-add-kpi").enable(true);
	        }
		});
	};
	
	$scope.calculate_score = function (kpi) {
		if (kpi.target != '' && kpi.target != null && kpi.target != undefined) {
			if (isNaN(kpi.target)) {
				alert("Target KPI must be a number");
				return;
			}
		}
		if (kpi.real != '' && kpi.real != null && kpi.real != undefined) {
			if (isNaN(kpi.real)) {
				alert("Target KPI must be a number");
				return;
			}
		}
		if (kpi.operator && !isEmpty(kpi.target) && !isEmpty(kpi.real) && !isNaN(kpi.target) && !isNaN(kpi.real)) {
			var score = 0, target, real;
			target = parseFloat(kpi.target);
			real = parseFloat(kpi.real);


			//score = kpi_score_calculator(kpi.operator, target, real);
			//if (score > 100) {
			//	score = 100;
			//}
			$scope.update_score_kpi(kpi, null);
		} else if (!isEmpty(kpi.target) && !isNaN(kpi.target)) {
			$scope.update_score_kpi(kpi, null);
		}
	}
	
	$scope.update_score_kpi = function (kpi, score) {
//		var data = {
//			id: kpi._id.$oid,
//			operator: kpi.operator,
//			target: kpi.target,
//			unit: kpi.unit,
//			real: kpi.real,
//			score: score
//		};

		   kpi.kpi_id = kpi.id;
        kpi.score = score;
        var data = kpi;


		$("#waiting").show();
		$('#ballsWaveG').fadeIn();
		$http.post('/performance/kpi/update-score/', data).success(function(response) {
			if (typeof response == "object") {
				kpi.score = response.score;
				$scope.data_kpi.score = response.final_score;
				if(!$scope.$$phase) {
					$scope.$apply();
				}
			} else {
				location.reload();
			}
			$("#waiting").hide();
			$('#ballsWaveG').fadeOut();
		}).error(function(data, status, headers, config) {
			$("#waiting").hide();
			$('#ballsWaveG').fadeOut();
			alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
		});		
	};
}]);