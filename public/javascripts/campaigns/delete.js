$(document).ready(function () {

	$('#deleteBtn').click(function () {
		var id = $('#campaignId').val();
		$.ajax({
			url: '/campaigns/' + id + '/delete',
			type: 'DELETE',
			success: function (result) {
				window.location.replace('/campaigns');
			},
			error: function(errors) {
				alert(errors);
			}
		});
	});
});