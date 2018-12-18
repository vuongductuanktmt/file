
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

module.directive('draggable', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	var apply_draggable = function () {
		    	if (!scope.current) {
		    		return;
		    	}
		    	
		    	if(attrs['postponed'] == "true") {
		    		return;
		    	}
			    if ($(elm).hasClass('drag-marker')) {
			    	  var left = $(".profile_title").offset().left + 291;
				      var right = left + 605;
				      var old_value = "";
				      elm.draggable({
				    	  axis: 'x', 
				    	  containment : [left,0,right,0],
				    	  start: function(evt,ui) {
				    		  try {
				    			  old_value = $(this).css('left');
				    		  } catch (e) {}
				    	  },
				    	  stop:function(evt,ui){
				    		  console.log($(this).css('left'));		    		  
				    		  var pos = parseInt($(this).css('left').replace("px",""));
				    		  var parent_id = $(this).attr('data-parent');
				    		  var value = pos >= 65 ? pos-65 : 0;
				    		  if ($(this).attr('data-type') == 'kpi') {
				    			  scope.update_kpi($(this).attr('data-id'), value * 100/540, old_value, this,parent_id);
				    		  } else if ($(this).attr('data-type') == 'comp') {
				    			  scope.update_comp($(this).attr('data-id'), value * 100/540, old_value, this,parent_id);
				    		  }
				    	  }
				      });
			      } else {
			    	  var left = $(".profile_title").offset().left + 271;
				      var right = left + 670;
				      var old_value = "";
				      elm.draggable({
				    	  axis: 'x', 
				    	  containment : [left,0,right,0],
				    	  start: function(evt,ui) {
				    		  try {
				    			  old_value = $(this).css('left');
				    		  } catch (e) {}
				    	  },
				    	  stop:function(evt,ui){
				    		  var pos = parseInt($(this).css('left').replace("px",""));
				    		  var init = parseInt($(".profile_title").offset().left + 271 + 40);
				    		  var value = pos >= init ? pos-init : 0;
				    		  if ($(this).attr('data-type') == 'kpi') {
				    			  scope.update_kpi($(this).attr('data-id'), value * 100/630, old_value, this);
				    		  } else if ($(this).attr('data-type') == 'comp') {
				    			  scope.update_comp($(this).attr('data-id'), value * 100/630, old_value, this);
				    		  }
				    		  console.log($(this).css('left'));
				    	  }
				      });
			      }
	    	}
	    	$timeout(function() {
	    		apply_draggable();
            }, 100);
	    }
	};
});
module.directive('tinycarousel', function($document) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	elm.tinycarousel({ display: 2 });
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

module.directive('timeago', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	var apply_timeago = function () {
	    		elm.timeago();
	    	};
	    	$timeout(function() {
	    		apply_timeago();
            }, 100);
	    }
	  };
});

module.directive('tooltipster', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	var apply_tooltip = function () {
	    		elm.tooltipster({
	    			content: 'Loading...',
	    			contentAsHTML: true,
	    			theme: 'tooltipster-default',
	    			interactive: true,
	    			trigger: 'click',
	    			functionBefore: function(origin, continueTooltip) {
	    				continueTooltip();
	    				var url = '/performance/cascade-kpi/' +origin.data('kpi')+"/"
	    				cloudjetRequest.ajax({
	    					type: 'GET',
	    					url: url,
	    					success: function(data) {
	    						origin.tooltipster('content', data).data('ajax', 'cached');
	    					}
	    				});
	    			}
	    		});
	    	};
	    	$timeout(function() {
	    		apply_tooltip();
            }, 100);
	    }
	  };
});

module.directive('select2', function($document) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	elm.select2();
	    	$(elm).on("change", function(e) {
	    		scope.employee_to = e.val;
	    	});
	    }
	  };
});

module.directive('select2', function($document) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	elm.select2();
	    	$(elm).on("change", function(e) {
	    		scope.employee_to = e.val;
	    	});
	    }
	  };
});

module.directive('editable', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	if (!scope.current) {
	    		return;
	    	}
	    	var apply_editable = function () {
	    		elm.editable({
	    			url:   '/performance/update-weighting/',
	    			emptytext: 0,
	    			inputclass: 'input-mini',
	    			validate: function (value) {
	    				if($.trim(value) == '') 
	    				    return gettext('This field is required.');
	    				if (isNaN(value)) {
	    					return gettext('Weighting must be a integer.');
	    				}
	    				value = parseInt(value);
	    				if (value < 0 || value > 100) {
	    					return gettext('Weighting must be in range from 0 to 100.');
	    				}
	    			},
	    			success: function (data) {
	    				var result = scope.get_kpi(data.id, data.parent_id);
	    				if (result.length == 1) {
	    					result[0].weight = data.weight;
	    				}
	    				var result = scope.get_kpi(data.parent_id);
	    				if (result.length == 1) {
	    					result[0].total_weight = data.total_weight;
	    					result[0].score = data.final_score;
	    					result[0].self_score = data.final_score;
	    				}
	    				
	    				if (scope.current) {
	    					var percent = scope.person_progress(scope.person, true);
	    					scope.update_review(percent, scope.person.user_id);
	    				}
	    				scope.person.kpi_final_score = data.kpi_final_score;
	    				scope.$apply();
	    			}
	    		});
	    	};
	    	
	    	$timeout(function() {
	    		apply_editable();
            }, 300);
	    }
	};
});

module.directive('editableorder', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	if (!scope.current) {
	    		return;
	    	}
	    	
	    	var apply_editable_order = function () {
	    		elm.editable({
	    			url:   '/performance/update-ordering/',
	    			emptytext: 0,
	    			inputclass: 'input-mini',
	    			validate: function (value) {
	    				if($.trim(value) == '') 
	    				    return gettext('This field is required.');
	    				if (isNaN(value)) {
	    					return gettext('The order must be a integer.');
	    				}
	    				value = parseInt(value);
	    				if (value <= 0 ) {
	    					return gettext('The order must be greater than 0.');
	    				}
	    			},
	    			success: function (data) {
	    				if (typeof data == "object") {
	    					var result = scope.get_kpi(data.id, data.parent_id);
		    				if (result.length == 1) {
		    					result[0].ordering = data.ordering;
		    				}
		    				scope.$apply();
	    				} else {
	    					alert(data);
	    				}
	    				
	    			}
	    		});
	    	};
	    	
	    	$timeout(function() {
	    		apply_editable_order();
            }, 300);
	    }
	};
});

module.directive('editablecategory', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	var apply_editable_order = function () {
	    		elm.editable({
	    			url:   '/performance/kpi/update-category/',
	    			emptytext: 0,
	    			display: function (value, sourceData) {
	    				var checked = $.fn.editableutils.itemsByValue(value, sourceData);
	    				if (checked.length != 0) {
	    					item = checked[0];
	    					value = item['value'];
	    					if (item['value'] != "") {
	    						$(this).html(scope.first_char(value))
	    					} else {
	    						$(this).html("..");
	    					}	     					
	    				} else {
	    					$(this).html("..");
	    				}
	    			},
	    			success: function (data) {
	    				
	    				if (typeof data == "object") {
	    					var result = scope.get_kpi(data.id, data.parent_id);
		    				if (result.length == 1) {
		    					result[0].category = data.category;
		    					result[0].category_order = data.category_order;
		    				}
		    				scope.$apply();
	    				} else {
	    					alert(data);
	    				}
	    			}
	    		});
	    	};
	    	
	    	$timeout(function() {
	    		apply_editable_order();
            }, 300);
	    }
	};
});

module.directive('editablereview', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	// console.log(elm)
	    	var apply_editable_review = function () {
	    		elm.editable({
	    			emptytext: gettext("Review last quarter"),
	    			display: function (value, sourceData) {
	    				var checked = $.fn.editableutils.itemsByValue(value, sourceData);
	    				if (checked.length != 0) {
	    					item = checked[0];
	    					text = item['text'];
	    					if (item['value'] != "") {
	    						$(this).html(text)
	    					} else {
	    						$(this).html(gettext("Final"));
	    					}	     					
	    				} else {
	    					$(this).html(gettext("Final"));
	    				}
	    			},
	    			success: function (data) {
	    				if (typeof data == "object") {
	    					var result = scope.get_kpi(data.id, data.parent_id);
		    				if (result.length == 1) {
		    					result[0].review_type = data.review_type;
		    				}
		    				scope.$apply();
	    				}
	    			}
	    		});
	    	};
	    	
	    	$timeout(function() {
	    		apply_editable_review();
            }, 300);
	    }
	};
});
module.directive('popover', function($document) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
    		elm.popover({
    			html: true,
	    		title: gettext("Factor Description") + " <i class='icon-remove close_btn' style='cursor: pointer' onclick=\"$('.btn_help').popover('hide')\" title=\"Close\"></i>",
	    		content: ""
	    	});    	
	    }
	  };
});
module.directive('autosize', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	var apply_autosize = function () {
	    		elm.autosize();
	    	};
	    	$timeout(function() {
	    		apply_autosize();
            }, 300);
    		
	    }
	  };
});

module.directive('helicopterpopover', function($timeout) {
	return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	    	var apply_popover = function () {
	    		var index = $(elm).attr('data-index');
	    		var person = scope.filteredPeople[index];
	    		content = "";
	    		content += '<div class="person-info">'; 
	    		content += '	<div class="clearfix">'; 
	    		content += '		<img class="p-avatar" alt="'+person.name+'" src="'+person.avatar+'" style="float: left;">'; 
	    		content += '		<div style="float: left;max-width:230px">'; 
	    		content += '			<label><strong>Role type</strong></label>'; 
	    		content += '			<label>'+person.job_title_name+'</label>'; 
	    		content += '			<label><strong>Position</strong></label>'; 
	    		content += '			<label>'+person.position+'</label>'; 
	    		content += '		</div>'; 
	    		content += '	</div>'; 
	    		content += '	<div>'+person.email+'</div>'; 
	    		content += '	<table>'; 
	    		content += '		<tbody>'; 
	    		content += '			<tr>'; 
	    		content += '				<td style="width: 140px">Employee ID: </td>'; 
	    		content += '				<td>'+person.employee_id+'</td>'; 
	    		content += '			</tr>'; 
	    		content += '			<tr>';
	    		content += '				<td>Manager: </td>';
	    		content += '				<td>'+person.manager_name+'</td>'; 
	    		content += '			</tr>';
	    		content += '			<tr>'; 
	    		content += '				<td colspan="2">'; 
	    		content += '					<a target="_blank" class="btn btn-small btn-primary" href="/performance/team-performance/?team='+person.manager_id+'">View review</a>'; 
	    		content += '				</td>'; 
	    		content += '			</tr>'; 
	    		content += '		</tbody>'; 
	    		content += '	</table>'; 
	    		content += '</div>';
	    		
	    		elm.popover({
	    			html: true,
		    		title: person.name + " <i class='icon-remove close_btn' style='cursor: pointer' onclick=\"$('.helicop_m_person').popover('hide')\" title='Close'></i>",
		    		content: content
		    	});
	    	};
	    	$timeout(function() {
	    		apply_popover();
            }, 200);    	
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

module.filter('unique', function() {
	return function (items, filterOn) {
	    if (filterOn === false) {
	      return items;
	    }

	    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
	      var hashCheck = {}, newItems = [];

	      var extractValueToCompare = function (item) {
	        if (angular.isObject(item) && angular.isString(filterOn)) {
	          return item[filterOn];
	        } else {
	          return item;
	        }
	      };

	      angular.forEach(items, function (item) {
	        var valueToCheck, isDuplicate = false;

	        for (var i = 0; i < newItems.length; i++) {
	          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
	            isDuplicate = true;
	            break;
	          }
	        }
	        if (!isDuplicate) {
	          newItems.push(item);
	        }

	      });
	      items = newItems;
	    }
	    return items;
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