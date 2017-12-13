var express = require('express'),
	mongoose = require('mongoose'),
	Users = require('../models/users'),
	Campaigns = require('../models/campaigns'),
	Comments = require('../models/comments'),
	Replies = require('../models/replies'),
	router = express.Router();

/* GET admin home page. */
router.get('/', function (req, res, next) {
	Users.getAllUsers(function(err,users){
		if(err){res.status(403).send();}
		Users.getReportedUsers(function(err,usersReported){
			if(err){res.status(403).send();}
			Campaigns.getAllCampaigns(function(err,campaigns){
				if(err){res.status(403).send();}
				Campaigns.getReportedCampaigns(function(err,campaignsReported){
					if(err){res.status(403).send();}
					Comments.getAllComments(function(err,comments){
						if(err){res.status(403).send();}
						Comments.getReportedComments(function(err,commentsReported){
							if(err){res.status(403).send();}
							Replies.getAllReplies(function(err,replies){
								if(err){res.status(403).send();}
								Replies.getReportedReplies(function(err,repliesReported){
									if(err){res.status(403).send();}
									res.render('admin/index', {
										nUsers: users.length,
										nUsersReported: usersReported.length,
										nCampaigns: campaigns.length,
										nCampaignsReported: campaignsReported.length,
										nComments: comments.length + replies.length,
										nCommentsReported: commentsReported.length + repliesReported.length
									});
								});
							});
						});
					});
				});
			});
		});
	});
});

/* GET admin home page. */
router.get('/users', function (req, res) {
	res.render('admin/users', {});
});

module.exports = router;