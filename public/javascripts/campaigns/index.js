$(document).ready(function () {
	$('#more_campaigns').click(function () {

		existingCampaigns = [];

		$('.id_campaign').each(function () {
			existingCampaigns.push($(this).val());
		});

		$.post('/campaigns/more', {
			existingCampaigns: existingCampaigns,
			nCampaigns: 6
		}, function (result) {
			$.each(result, function (i, campaign) {
				$('#more_campaigns').parent().before(getCampaignCard(campaign)
				);
			});
		});
	});
});



