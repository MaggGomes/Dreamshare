var order = 'default';
var funds = null;

$(document).ready(function () {
	if(window.location.href.indexOf('true') > -1)
		funds = true;
	else if(window.location.href.indexOf('false') > -1)
		funds = false;

	checkCBoxes();

	$('#more_campaigns').click(function () {

		existingCampaigns = [];

		$('.id_campaign').each(function () {
			existingCampaigns.push($(this).val());
		});

		$.get('/campaigns', {
			order: order,
			funds: funds,
			existingCampaigns: existingCampaigns
		}, function (result) {
			$.each(result.campaigns, function (i, campaign) {
				$('#more_campaigns').parent().before(getCampaignCard(campaign)
				);
			});
		});
	});

	$('#mostContri').click(function(){
		order = 'mostContri';
		updateShowCamp();
	});

	$('#mostRecent').click(function(){
		order = 'mostRecent';
		updateShowCamp();
	});

	$('#nearest').click(function(){
		order = 'nearest';
		updateShowCamp();
	});

	$('#funds').change(function(){
		if($(this).is(':checked')) {
			if(funds == false){
				funds = null;
			}
			else funds = true;
		}
		else {
			if(funds == true){
				funds = null;
			} else funds = false;
		}
		updateShowCamp();
	});

	$('#goods').change(function(){
		if($(this).is(':checked')) {
			if(funds == true){
				funds = null;
			}
			else funds = false;
		}
		else {
			if(funds == false){
				funds = null;
			} else funds = true;
		}
		updateShowCamp();
	});
});

function updateShowCamp(){
	console.log('FUNDS: ');
	console.log(funds);
	$.get('/campaigns', {
		order: order,
		funds: funds
	}, function (result) {
		$('#campaignsCard .col-sm-6.col-lg-4.mb-5').remove();
		$.each(result.campaigns, function (i, campaign) {
			$('#more_campaigns').parent().before(getCampaignCard(campaign));
		});
	});
}

function  checkCBoxes() {
	if (funds == 'true') {
		$('#funds').prop('checked', true);
	}
	else if (funds == 'false') {
		$('#goods').prop('checked', true);
	}
}



