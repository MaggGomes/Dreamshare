var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

/* Sign in user */
router.post('/signin', function (req, res, next) {
	mongoose.model('User').findOne({email: req.body.email}, function (err, user) {
		if (err) {
			next(err);
		} else {
			if (!user) {
				res.status('401').send('401');
			} else {
				if (bcrypt.compareSync(req.body.password, user.password)) {
					req.session.user = user.name;
					req.session.email = user.email;
					req.session.userID = user._id;
					res.cookie('user', user.email).status('200').send('200');
				} else {
					res.status('400').send('400');
				}
			}
		}
	});
});

/* Sign in user */
router.post('/signin/3rdparty', function (req, res, next) {
	mongoose.model('User').findOne({email: req.body.email}, function (err, user) {
		if (err) {
			next(err);
		} else {
			if (!user) {
				mongoose.model('User').create({
					name: req.body.name,
					email: req.body.email,
					photo: req.body.photo
				}, function (err) {
					if (err) {
						next(err);
					} else {
						mongoose.model('User').findOne({email: req.body.email}, function (err, user) {
							if (err) {
								next(err);
							} else {
								if (!user) {
									res.status('401').send('401');
								} else {
									req.session.user = user.name;
									req.session.email = user.email;
									req.session.userID = user._id;
									res.cookie('user', user.email).status('200').send('200');
								}
							}
						});
					}
				});

			} else {
				req.session.user = user.name;
				req.session.email = user.email;
				req.session.userID = user._id;
				res.cookie('user', user.email).status('200').send('200');
			}
		}
	});
});

/* Sign in user */
router.get('/logout', function (req, res, next) {
	req.session.destroy(function () {
		res.clearCookie('user').redirect('/');
	});
});

/* Creates a new user */
router.post('/register', function (req, res, next) {
	mongoose.model('User').findOne({email: req.body.email}, function (err, user) {
		if (err) {
			next(err);
		} else {
			if (!user) {
				var hash = bcrypt.hashSync(req.body.password, 10);

				mongoose.model('User').create({
					name: req.body.name,
					email: req.body.email,
					password: hash
				}, function (err) {
					if (err) {
						next(err);
					} else {
						mongoose.model('User').findOne({email: req.body.email}, function (err, user) {
							if (err) {
								next(err);
							} else {
								if (!user) {
									res.status('401').send('401');
								} else {
									req.session.user = user.name;
									req.session.email = user.email;
									req.session.userID = user._id;
									res.cookie('user', user.email).status('200').send('200');
								}
							}
						});
					}
				});

			} else {
				res.status('400').send('400');
			}
		}
	});
});

module.exports = router;
