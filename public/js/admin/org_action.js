$(document).ready(function (){
	$(".actions select").change(function () {
		var selected = $(this).val();
		if (selected == "import_kpi") {
			$("#id_file_input").remove();
			$("#changelist-form").attr('enctype', "multipart/form-data");
			$("#changelist-form").append("<input type='file' name='kpi' id='id_file_input'>");
			$("#id_file_input").click();
		}
	});
});