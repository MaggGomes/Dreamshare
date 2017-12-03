function popupAlert(text, success){
	var alertType = 'danger';
	if(success){
		alertType = 'success';
	}
	$('body').prepend('<div class="alert alert-' + alertType + ' alert-dismissible fade show" role="alert">' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
		'<span aria-hidden="true">&times;</span>' +
		'</button>' +
		text +
		'</div>');
	$('.alert').fadeTo(2000, 500).slideUp(500, function(){
		$('.alert').slideUp(500);
	});
};