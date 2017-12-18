var express = require('express'),
	mongoose = require('mongoose'),
	Users = require('../models/users'),
	Donations = require('../models/donations'),
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
					Donations.getDonationsByUser(req.session.userID, function (err, donations) {
						if (err) { next(err); } else {
							res.render('pages/account/index', {user: user, donations: donations, userLogged: userLogged});
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