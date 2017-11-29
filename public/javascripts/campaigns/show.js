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

