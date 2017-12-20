var express = require('express'),
	mongoose = require('mongoose'),
	Users = require('../models/users'),
	Campaigns = require('../models/campaigns'),
	router = express.Router();


/* GET account home page */
router.get('/', function (req, res, next) {
	if (req.session.user) {
		userLogged = true;

		Users.getUser(req.session.userID, function (err, user) {
			if (err) {
				next(err);
			} else {
				if (!user) {
					res.sendStatus(400);
				} else {
					Campaigns.getCampaignsWithDonationsByUser(req.session.userID, function(err, contributions){
						if (err) { next(err); } else {
							Campaigns.getCampaignsByUser(req.session.userID, function (err, campaigns) {
								if (err) { next(err); } else {
									res.render('pages/account/index', {user: user, contributions: contributions, campaigns: campaigns, userLogged: userLogged});
								}
							});
						}
					});
				}
			}
		});

	} else {
		next(401);
	}
});


// TODO - FALTA IMPLEMENTAT
/* POST edit profile */
router.post('/editprofile', function (req, res, next) {


});

module.exports = router;