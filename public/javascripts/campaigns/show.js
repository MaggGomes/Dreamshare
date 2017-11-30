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