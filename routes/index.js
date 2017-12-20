var express = require('express'),
	mongoose = require('mongoose'),
	campaigns = require('../models/campaigns'),
	users = require('../models/users'),
	router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	if (req.session.user) {
		userLogged = true;
	} else {
		userLogged = false;
	}

	mongoose.model('Campaign').find({isFunds: true}, function (err, fundsCampaigns) {
		if (err) throw err;
		mongoose.model('Campaign').find({isFunds: false}, function (err, goodsCampaigns) {
			if (err) throw err;
			var renderIndex = function (err, trendingCampaigns) {
				if (err) throw err;
				res.render('pages/index', {
					fundsCampaigns: fundsCampaigns,
					goodsCampaigns: goodsCampaigns,
					trendingCampaigns: trendingCampaigns,
					userLogged: userLogged
				});
			};
			if (userLogged) {
				users.getCoords( req.session.userID, function (err, coords) {
					if (err) {
						campaigns.getTrending(3, renderIndex);
					} else {
						campaigns.getTrendingWithCoords(3, coords.lat, coords.lng, renderIndex);
					}
				});
			}else{
				campaigns.getTrending(3, renderIndex);
			}
		}).limit(3);
	}).limit(3);
});

module.exports = router;