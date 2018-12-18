function invite() {
	
}
function invite_review() {
	cloudjetRequest.ajax({
        type: 'POST',
        data: {
        	name: $('#name-review').val(),
        	email: $('#email-review').val(),
        	type: $('#type-review').val(),
        	message: $('message-review').val()
        },        			        
        url: "/performance/own-performance/invite_review/",
        
        success:function(data) {
        	alert("Invitation Sent Successfully!!!");
        	$('#inviteModal').modal('hide');
        },
        error:function(jqXHR, textStatus, errorThrown) {	
        	
        }
	});	
}