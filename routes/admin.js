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
		if(err){res.sendStatus(403);}
		Users.getReportedUsers(function(err,usersReported){
			if(err){res.sendStatus(403);}
			Campaigns.getAllCampaigns(function(err,campaigns){
				if(err){res.sendStatus(403);}
				Campaigns.getReportedCampaigns(function(err,campaignsReported){
					if(err){res.sendStatus(403);}
					Comments.getAllComments(function(err,comments){
						if(err){res.sendStatus(403);}
						Comments.getReportedComments(function(err,commentsReported){
							if(err){res.sendStatus(403);}
							Replies.getAllReplies(function(err,replies){
								if(err){res.sendStatus(403);}
								Replies.getReportedReplies(function(err,repliesReported){
									if(err){res.sendStatus(403);}
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
	if(req.query.reported == 'true') {
		Users.getReportedUsers(function(err,usersReported) {
			if (err) { res.sendStatus(403); }
			res.render('admin/users', {users: usersReported});
		});
	} else {
		Users.getAllUsers(function(err,users) {
			if (err) { res.sendStatus(403); }
			res.render('admin/users', {users: users});
		});
	}
});

/* GET admin home page. */
router.get('/campaigns', function (req, res) {
	if(req.query.reported == 'true') {
		Campaigns.getReportedCampaigns(function(err, campaignsReported) {
			if (err) { res.sendStatus(403); }
			res.render('admin/campaigns', {campaigns: campaignsReported});
		});
	} else {
		Campaigns.getAllCampaigns(function(err,campaigns) {
			if (err) { res.sendStatus(403); }
			res.render('admin/campaigns', {campaigns: campaigns});
		});
	}
});

/* GET admin home page. */
router.get('/comments', function (req, res) {
	if(req.query.reported == 'true') {
		Comments.getReportedComments(function(err,commentsReported) {
			if(err){res.sendStatus(403);}
			Replies.getReportedReplies(function(err,repliesReported){
				if(err){res.sendStatus(403);}
				res.render('admin/comments', {comments: commentsReported.concat(repliesReported)});
			});
		});
	} else {
		Comments.getAllComments(function(err,comments) {
			if (err) { res.sendStatus(403); }
			Replies.getAllReplies(function(err,replies){
				if(err){res.sendStatus(403);}
				res.render('admin/comments', {comments: comments.concat(replies)});
			});
		});
	}
});

module.exports = router;