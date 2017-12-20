/* Real time countdown for the campaigns*/
// Set the date we're counting down to
var campaignCountDownDate = new Date($('#campaignEndDate').val());

// Update the count down every 1 second
var x = setInterval(function () {

	// Get todays date and time
	var now = new Date().getTime();

	// Find the distance between now an the count down date
	var distance = campaignCountDownDate - now;

	// Time calculations for days, hours, minutes and seconds
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	if (days < 1 && hours < 4)
		document.getElementById('time-left-counter').innerHTML = (hours * 60) + minutes + ' <span class="timer-description">minutos</span> e ' + seconds + ' <span class="timer-description">segundos</span>';
	else if (days < 3)
		document.getElementById('time-left-counter').innerHTML = (24 * days + hours) + ' <span class="timer-description">horas</span> e ' + minutes + ' <span class="timer-description">minutos</span>';
	else if (days >= 7)
		document.getElementById('time-left-counter').innerHTML = days + ' <span class="timer-description">dias</span> e ' + hours + ' <span class="timer-description">horas</span>';

	// If the count down is finished, write some text
	if (distance < 0) {
		clearInterval(x);
		document.getElementById('time-left-counter').innerHTML = 'Expirou!';
	}
}, 1000);

$(document).ready(function() {

	$('#reportBtn').click(function () {
		var id = $('#campaignId').val();
		var description = $('input[name=reportRadio]:checked').val();
		if(description == 'other'){
			description = $('#otherDescription').val();
		}
		$.ajax({
			url: '/campaigns/' + id + '/report',
			type: 'POST',
			data: {
				description: description
			},
			success: function (result) {
				alert('A campanha foi reportada com sucesso');
			},
			error: function(errors) {
				alert(errors);
			}
		});
	});

	$(document).on('submit', '.comment-form', function(e) {
		var textarea = $(this).children('textarea');

		var url = $(this).attr('action');
		var username = getCookie('name');
		var content = $(textarea).val();
		var campaign = $('.main-container').attr('data-campaign');

		$.post(url, {comment: content}, function (data, success, xhr) {
			if (xhr.status !== 400) {
				var id = data._id;
				var date = new Date(data.date);

				var day = date.getDate();
				var month = date.getMonth();
				var year = date.getFullYear();
				var hour =  '' + date.getHours();
				while (hour.length < 2) {hour = '0' + hour;}
				var minute =  '' + date.getMinutes();
				while (minute.length < 2) {minute = '0' + minute;}

				$('#commentArea').collapse('hide');
				$(textarea).val('');

				$('#comments').append(''+
					'<div class="media mb-4 comment-container" data-comment="' + id + '">'+
					'<img class="d-flex align-self-start mr-3 media-img" src="http://placehold.it/64x64" alt="">'+
					'<div class="media-body">'+
					'<button class="btn btn-primary btn-sm ml-1 pull-right delete-comment">\n' +
					'<i class="fa fa-trash-o"></i>\n' +
					'</button>\n' +
					'<button class="btn btn-primary btn-sm ml-1 pull-right edit-comment">\n' +
					'<i class="fa fa-pencil-square-o"></i>\n' +
					'</button>'+
					'<h5 class="mt-0">' + username + ' <small class="small text-muted">' + day + '/' + (month+1) + '/' + year + ' às ' + hour + ':' + minute + '</small></h5>'+
					'<div class="comment-text preformatted">' + content + '</div>'+
					'<div class="mt-3">'+
					'<a href="#replyArea' + id + '" class="btn btn-primary find-btn mb-4" data-toggle="collapse">Responder</a>'+
					'<div id="replyArea' + id + '" class="collapse">'+
					'<form class="reply-form" action="<' + campaign + '/' + id +'/reply" method="post">'+
					'<textarea rows="5" cols="60" name="reply" required></textarea>'+
					'<button type="submit" class="btn btn-primary find-btn d-block">Submeter</button>'+
					'</form>'+
					'</div>'+
					'</div>'+
					'</div>'+
					'</div>'
				);
			}
		});
		e.preventDefault();
	});

	$(document).on('submit', '.reply-form', function(e) {
		var container = $(this).closest('.media-body');
		var textarea = $(this).children('textarea');

		var url = $(this).attr('action');
		var username = getCookie('name');
		var content = $(textarea).val();

		$.post(url, {reply: content}, function (data, success, xhr) {
			if (xhr.status !== 400) {
				var id = data._id;
				var date = new Date(data.date);

				var day = date.getDate();
				var month = date.getMonth();
				var year = date.getFullYear();
				var hour =  '' + date.getHours();
				while (hour.length < 2) {hour = '0' + hour;}
				var minute =  '' + date.getMinutes();
				while (minute.length < 2) {minute = '0' + minute;}

				$(textarea).closest('div').collapse('hide');
				$(textarea).val('');

				$(container).append(''+
					'<div class="media mt-3 reply-container" data-reply="' + id + '">'+
					'<a class="d-flex pr-3" href="#">'+
					'<img class="d-flex align-self-start mr-3 media-img" src="http://placehold.it/64x64" alt="">'+
					'</a>'+
					'<div class="media-body">'+
					'<button class="btn btn-primary btn-sm ml-1 pull-right delete-reply">'+
					'<i class="fa fa-trash-o"></i>'+
					'</button>'+
					'<button class="btn btn-primary btn-sm ml-1 pull-right edit-reply">'+
					'<i class="fa fa-pencil-square-o"></i>'+
					'</button>'+

					'<h5 class="mt-0">' + username + ' <small class="text-muted">' + day + '/' + (month+1) + '/' + year + ' às ' + hour + ':' + minute + '</small></h5>'+
					'<div class="reply-text preformatted">' + content + '</div>'+
					'</div>'+
					'</div>'
				);
			}
		});
		e.preventDefault();
	});

	$(document).on('click', '.delete-comment', function() {
		var container = $(this).closest('.comment-container');
		var campaignID = $('.main-container').attr('data-campaign');
		var commentID = $(container).attr('data-comment');
		$.post({
			url: '/campaigns/' + campaignID + '/' + commentID + '/delete',
			success: function() {
				var value = parseInt($('#n-comments').text(), 10) - 1;
				$('#n-comments').text(value);
				$(container).remove();
			}
		});
	});

	$(document).on('click', '.edit-comment', function() {
		// Transform comment area to textarea
		var commentText = $(this).siblings('.comment-text');
		var text = $(commentText).text();
		$(commentText).text('');
		$(commentText).append('<textarea rows="5" cols="60" name="comment"></textarea>');
		$(commentText).children('textarea').val(text);

		// Change edit button to save button
		$(this).toggleClass('edit-comment');
		$(this).toggleClass('save-comment');
		$(this).children('i').toggleClass('fa-pencil-square-o');
		$(this).children('i').toggleClass('fa-floppy-o');
	});

	$(document).on('click', '.save-comment', function() {
		var button = this;
		var container = $(this).closest('.comment-container');
		var campaignID = $('.main-container').attr('data-campaign');
		var commentID = $(container).attr('data-comment');
		var text = $(this).siblings('.comment-text').children('textarea').val();

		$.ajax({
			url: '/campaigns/' + campaignID + '/' + commentID + '/edit',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({text: text}),
			success: function() {
				// Remove textarea and set text
				var commentText = $(button).siblings('.comment-text');
				$(commentText).children('textarea').remove();
				$(commentText).text(text);

				// Change save button to edit button
				$(button).toggleClass('edit-comment');
				$(button).toggleClass('save-comment');
				$(button).children('i').toggleClass('fa-pencil-square-o');
				$(button).children('i').toggleClass('fa-floppy-o');
			}
		});
	});

	$(document).on('click', '.delete-reply', function() {
		var commentContainer = $(this).closest('.comment-container');
		var replyContainer = $(this).closest('.reply-container');
		var campaignID = $('.main-container').attr('data-campaign');
		var commentID = $(commentContainer).attr('data-comment');
		var replyID = $(replyContainer).attr('data-reply');

		$.post({
			url: '/campaigns/' + campaignID + '/' + commentID + '/' + replyID + '/delete',
			success: function() {
				$(replyContainer).remove();
			}
		});
	});

	$(document).on('click', '.edit-reply', function() {
		// Transform comment area to textarea
		var replyText = $(this).siblings('.reply-text');
		var text = $(replyText).text();
		$(replyText).text('');
		$(replyText).append('<textarea rows="5" cols="60" name="reply"></textarea>');
		$(replyText).children('textarea').val(text);

		// Change edit button to save button
		$(this).toggleClass('edit-reply');
		$(this).toggleClass('save-reply');
		$(this).children('i').toggleClass('fa-pencil-square-o');
		$(this).children('i').toggleClass('fa-floppy-o');
	});

	$(document).on('click', '.save-reply', function() {
		var button = this;
		var commentContainer = $(this).closest('.comment-container');
		var replyContainer = $(this).closest('.reply-container');
		var campaignID = $('.main-container').attr('data-campaign');
		var commentID = $(commentContainer).attr('data-comment');
		var replyID = $(replyContainer).attr('data-reply');

		var text = $(this).siblings('.reply-text').children('textarea').val();

		$.ajax({
			url: '/campaigns/' + campaignID + '/' + commentID + '/' + replyID + '/edit',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({text: text}),
			success: function() {
				// Remove textarea and set text
				var replyText = $(button).siblings('.reply-text');
				$(replyText).children('textarea').remove();
				$(replyText).text(text);

				// Change save button to edit button
				$(button).toggleClass('edit-reply');
				$(button).toggleClass('save-reply');
				$(button).children('i').toggleClass('fa-pencil-square-o');
				$(button).children('i').toggleClass('fa-floppy-o');
			}
		});
	});
});

function getCookie(cname) {
	var name = cname + '=';
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}