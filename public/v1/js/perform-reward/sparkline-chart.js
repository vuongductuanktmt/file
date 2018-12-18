$(function() {
	
//	var base_options={
//			type:'line',//ok
//	    	width:'100%',
//	    	height:'40px',//ok
//			lineColor:'green',//ok
//			fillColor:false,//ok
//			defaultPixelsPerValue:20,//applied when not set width
//			highlightSpotColor:'#003464',//ok
//			spotRadius:3,//bán kính của đốm tròn
//			spotColor:false,
//			minSpotColor:false,
//			maxSpotColor:false,
//			valueSpots:{'0:': '#31B0F1'},//ok
//			tooltipChartTitle:'<i>Total Salary Budget</i>',
//			tooltipPrefix:'tooltipPrefix',
//			tooltipSuffix:'tooltipSuffix',
//			tooltipFormat :
//				'<div style="">\
//					- Month: <span style="font-size:1.5em; font-weight:bold; color:yellow;">{{x}}</span><br> \
//					- Budget: <span style="font-size:1.5em; font-weight:bold; color:yellow;"> {{y}}</span>\
//				</div>',
//	}
//    /** This code runs when everything has been loaded on the page */
//    /* Inline sparklines take their values from the contents of the tag */
//   // var myvalues = [ [1,3], [2,6], [8,9], [11,12], [12,7] ];
//	var total_budget_chart_options=$.extend({}, base_options);
//    $('#total_budget_chart').sparkline('html', total_budget_chart_options); 
//    
//    var reward_cap_chart_options=$.extend({}, base_options);
//    $('#reward_cap_chart').sparkline('html', reward_cap_chart_options); 
//    
//    var max_reward_chart_options=$.extend({}, base_options);
//    $('#max_reward_chart').sparkline('html', max_reward_chart_options); 
//    
//    
//    
//    
//    var employee_trend_chart_options=$.extend({}, base_options, {width:'100px', height:'30px', tooltipFormat :
//		'<div style="">\
//		- Month: <span style="font-size:1.5em; font-weight:bold; color:yellow;">{{x}}</span><br> \
//		- Performance: <span style="font-size:1.5em; font-weight:bold; color:yellow;"> {{y}} %</span>\
//	</div>',});
//    $('.employee-trend').sparkline('html', employee_trend_chart_options);
//    $('.employee-trend').bind('sparklineRegionChange', function(ev) {
//    	//alert('mouse over');
//    	console.log(ev);
//    });
});