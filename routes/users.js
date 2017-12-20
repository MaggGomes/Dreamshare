var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Users = require('../models/users'),
	bcrypt = require('bcrypt'),
	multer = require('multer'),
	upload = multer({
		dest: 'images/users/',
		fileFilter: function (req, file, cb) {
			if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
				return cb(new Error('Only image files are allowed!'));
			}
			cb(null, true);
		}
	});

/* Sign in user */
router.post('/signin', function (req, res, next) {
	mongoose.model('User').findOne({email: req.body.email}, function (err, user) {
		if (err) {
			next(err);
		} else {
			if (!user) {
				res.status('401').send('401');
			} else {
				if (bcrypt.compareSync(req.body.password, user.password) && (user.status == 'ACTIVE' || user.status == 'MODERATE')) {
					req.session.user = user.name;
					req.session.email = user.email;
					req.session.userID = user._id;
					req.session.isAdmin = user.isAdmin;
					res.cookie('name', user.name).cookie('user', user.email).status('200').send('200');
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
								} else if (user.status == 'ACTIVE' || user.status == 'MODERATE'){
									req.session.user = user.name;
									req.session.email = user.email;
									req.session.userID = user._id;
									req.session.isAdmin = user.isAdmin;
									res.cookie('name', user.name).cookie('user', user.email).status('200').send('200');
								}
							}
						});
					}
				});

			} else if (user.status == 'ACTIVE' || user.status == 'MODERATE'){
				req.session.user = user.name;
				req.session.email = user.email;
				req.session.userID = user._id;
				req.session.isAdmin = user.isAdmin;
				res.cookie('name', user.name).cookie('user', user.email).status('200').send('200');
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
									req.session.isAdmin = user.isAdmin;
									res.cookie('name', user.name).cookie('user', user.email).status('200').send('200');
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


/* Edits a user */
router.post('/:userId/edit', upload.array(), function (req, res, next) {
	if (req.session.user) {
		if(req.session.userID == req.params.userId || req.session.isAdmin) {
			if((req.body.email && req.body.email != req.session.email) || (req.body.newPassword && req.body.newPassword2)){
				if(req.body.email){
					req.checkBody('email', 'Devee ser um e-mail').isEmail();
				}
				if(req.body.newPassword){
					req.checkBody('newPassword', 'Passwords não correspondem').isEqual(req.body.newPassword2);
					req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 10);
				}
				req.checkBody('password', 'Password tem de ser preenchida').notEmpty();
			}

			if(req.body.name) {
				req.checkBody('name', 'O nome precisa de ter pelo menos 3 caracteres').isLength({min: 3});
				req.checkBody('name', 'O nome não pode ter mais que 100 caracteres').isLength({max: 100});
			}
			if(req.body.biography) {
				req.checkBody('biography', 'A descrição precisa de ter pelo menos 10 caracteres').isLength({min: 10});
				req.checkBody('biography', 'A descrição não pode ter mais que 250 caracteres').isLength({max: 250});
			}

			var errors = req.validationErrors();
			if (errors) {
				console.log(errors);
				res.render('pages/account/index', {errors: errors, inputs: req.body});
				return;
			}
			Users.updateUser(req.params.userId,
				req.body.email,
				req.body.newPassword,
				req.body.name,
				req.body.genre,
				req.body.lat,
				req.body.lng,
				req.body.address,
				req.body.location,
				req.body.birthdate,
				req.body.biography,
				req.body.photo,
				function(err, user){
					if (err) { console.log(err); res.sendStatus(400); } else {
						console.log(user);
						res.redirect('/account');
					}
				});
		} else {
			res.sendStatus(401);
		}
	} else {
		res.sendStatus(403);
	}
});

/* Deactivate user */
router.post('/:userId/deactivate', upload.array(), function (req, res, next) {
	if (req.session.user) {
		if(req.session.userID == req.params.userId) {
			Users.updateUserStatus(req.params.userId,
				'DEACTIVATED',
				function(err, user){
					if (err) { console.log(err); res.sendStatus(400); } else {
						req.session.destroy(function () {
							res.clearCookie('user').redirect('/');
						});
					}
				});
		} else {
			res.sendStatus(401);
		}
	} else {
		res.sendStatus(403);
	}
});

/* Removes user */
router.post('/:userId/remove', upload.array(), function (req, res, next) {
	if (req.session.user) {
		if(req.session.isAdmin) {
			Users.updateUserStatus(req.params.userId,
				'REMOVED',
				function(err, user){
					if (err) { console.log(err); res.sendStatus(400); } else {
						console.log(user);
						res.sendStatus(200);
					}
				});
		} else {
			res.sendStatus(401);
		}
	} else {
		res.sendStatus(403);
	}
});

/* Moderates user */
router.post('/:userId/moderate', upload.array(), function (req, res, next) {
	if (req.session.user) {
		if(req.session.isAdmin) {
			Users.updateUserStatus(req.params.userId,
				'MODERATED',
				function(err, user){
					if (err) { console.log(err); res.sendStatus(400); } else {
						console.log(user);
						res.sendStatus(200);
					}
				});
		} else {
			res.sendStatus(401);
		}
	} else {
		res.sendStatus(403);
	}
});

module.exports = router;
