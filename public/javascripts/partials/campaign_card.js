function getCampaignCard(campaign){
	var progress_ratio = 100;
	if (campaign.progress < campaign.goal) {
		progress_ratio = campaign.progress / campaign.goal * 100;
	};
	return '<div class="col-lg-4 col-md-4 mb-4 campaign_div">' +
		'<div class="card">' +
		'<a class="card-link" href="/campaigns/' + campaign._id + '"></a>' +
		'<img class="card-img-top campaign_img" src="/' + campaign.image + '" alt="">' +
		'<div class="card-body">' +
		'<h4 class="card-title"><a class="title_link" href="/campaigns/' + campaign._id + '" > ' + campaign.title + '</a></h4>' +
		'<p class="card-text">' + campaign.description + '</p>' +
		'</div>' +
		'<div class="card-footer">' +
		'<div class="card-progress progress">' +
		'<div class="progress-bar" role="progressbar" aria-valuenow="' + campaign.progress + '" ' +
		'aria-valuemin="0" aria-valuemax=" ' + campaign.goal + '" style="width:' + progress_ratio + '%">' +
		'</div>' +
		'</div>' +
		'<div>' +
		'<span class="card-footer-">' + parseInt(progress_ratio) + '%</span> concluído' +
		'</div>' +
		'<div class="campaign-location">' +
		'<span><i class="fa fa-map-marker" aria-hidden="true"></i></span> <div class="latlng_campaign">' +
		'<p class="card-text">' + campaign.location + '</p>' +
		'<input type="hidden" value="' + campaign.lat + '">' +
		'<input type="hidden" value="' + campaign.lng + '">' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<input type="hidden" class="id_campaign" value="' + campaign._id + '">' +
		'</div>';
}