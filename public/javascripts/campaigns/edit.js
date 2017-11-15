$(document).ready(function () {
	$('#editBtn').click(function () {
		$( '.edit-info' ).removeClass( 'edit-info' );
		$( '.hidden-info').css('display', 'none');
	});


	$('#saveBtn').click(function () {
		var id = $('#campaignId').val();
		var title = $('#title').val();
		var description = $('#description').val();
		var endDate = $('#endDate').val();
		$.ajax({
			url: '/campaigns/' + id + '/edit',
			type: 'PUT',
			data: {title: title, description: description, endDate: endDate},
			success: function (result) {
				window.location.replace('/campaigns/' + id);
			},
			error: function(errors) {
				alert(errors);
			}
		});
	});
});