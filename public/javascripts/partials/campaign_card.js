function getCampaignCard(campaign){
	var progress_ratio = 100;
	var icon;
	if (campaign.progress < campaign.goal) {
		progress_ratio = campaign.progress / campaign.goal * 100;
	};
	if(campaign.isFunds) {
		icon = 'icon-bars';
	} else {
		icon = 'icon-charity';
	};
	return '<div class="col-sm-6 col-lg-4 mb-5">' +
		'<div class="card">' +
		'<a class="card-link" href="/campaigns/' + campaign._id + '">' +
		'<img class="card-img-top campaign_img" src="/' + campaign.image + '" alt="">' +
		'<div class="card-body">' +
		'<h4 class="card-title">' + campaign.title + '</h4>' +
		'<p class="card-text">' + campaign.description + '</p>' +
		'</div>' +
		'</a>' +
		'<div class="card-footer">' +
		'<div class="card-progress progress">' +
		'<div class="progress-bar" role="progressbar" aria-valuenow="' + campaign.progress + '" ' +
		'aria-valuemin="0" aria-valuemax=" ' + campaign.goal + '" style="width:' + progress_ratio + '%">' +
		'</div>' +
		'</div>' +
		'<div>' +
		'<span class="card-footer-">' + parseInt(progress_ratio) + '%</span> concluído' +
		'<svg class="icon ' + icon + ' pull-right"><use xlink:href="#' + icon + '"></use></svg>' +
		'</div>' +
		'<a href="/campaigns/map?lat=' + campaign.lat + '&lng=' + campaign.lng + '">' +
		'<div class="campaign-description-wrapper">' +
		'<svg class="icon icon-location"><use xlink:href="#icon-location"></use></svg>'+
		'<div class="campaign-description-text">'+
		'<p class="card-text">' + campaign.location + '</p>' +
		'<input type="hidden" value="' + campaign.lat + '">' +
		'<input type="hidden" value="' + campaign.lng + '">' +
		'</div>' +
		'</div>' +
		'</a>' +
		'</div>' +
		'</div>'+
		'<input type="hidden" class="id_campaign" value="' + campaign._id + '">' +
		'</div>';
}