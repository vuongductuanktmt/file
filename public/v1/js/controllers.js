var cjs = angular.module('cloudjet', []);

var editingId = undefined;
cjs.controller('KpiTreeController', ['$scope', function($scope) {
	$scope.add_row = function () {
		var node = $('#kpi-tree').treegrid('getSelected');
		if (node){
			$('#kpi-tree').treegrid('insert', {
				before: node.id,
				data: {
					id: null,
					name: '',
				}
			});
		}
	};
	
	$scope.remove_row = function () {
		 var node = $('#kpi-tree').treegrid('getSelected');
         if (node){
             $('#kpi-tree').treegrid('remove', node.id);
         }
	};
	
	$scope.edit_row = function () {
		if (editingId != undefined){
            $('#kpi-tree').treegrid('select', editingId);
            return;
        }
        var row = $('#kpi-tree').treegrid('getSelected');
        if (row){
            editingId = row.id
            $('#kpi-tree').treegrid('beginEdit', editingId);
        }
        
        editor = $("#kpi-tree").datagrid("getEditor", {index: editingId, field:"user__profile__display_name"});
        editor.target.combobox('reload', '/performance/subordinate/users/?user_id=' + row.user_id)
	};
	
	$scope.save_row = function () {
		if (editingId != undefined) {
            var t = $('#kpi-tree');
            t.treegrid('endEdit', editingId);
            editingId = undefined;
            var persons = 0;
            var rows = t.treegrid('getChildren');
        }
	};
	
	$scope.cancel_row = function () {
		if (editingId != undefined){
            $('#kpi-tree').treegrid('cancelEdit', editingId);
            editingId = undefined;
        }
	};
}]);