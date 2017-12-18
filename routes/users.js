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
					req.session.isAdmin = user.isAdmin;
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
									req.session.isAdmin = user.isAdmin;
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
				req.session.isAdmin = user.isAdmin;
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
									req.session.isAdmin = user.isAdmin;
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


/* Creates a new user */
router.post('/:userId/edit', function (req, res, next) {
	if (req.session.user) {
		if(req.session.userID == req.params.userId || req.session.isAdmin) {
			console.log('teste ' + req.body.title);
			console.log(req.body.croppedImage);
			var buf = new Buffer(req.body.croppedImage, 'base64');
			console.log(buf);
			fs.writeFile('images/campaigns/teste.png', buf, function (err) {
				console.log(err);
			});
			req.checkBody('title', 'O título precisa de ter pelo menos 5 caracteres').isLength({min: 5});
			req.checkBody('title', 'O título não pode ter mais que 100 caracteres').isLength({max: 100});
			req.checkBody('description', 'A descrição precisa de ter pelo menos 25 caracteres').isLength({min: 25});
			req.checkBody('description', 'A descrição não pode ter mais que 250 caracteres').isLength({max: 250});
			req.checkBody('isFunds', 'Tipo de funds é obrigatório').notEmpty();
			req.checkBody('goal', 'O objetivo da campanha tem que ser maior que 0').notEmpty();
			req.checkBody('endDate', 'Campanha tem que ter uma data final').notEmpty();
			req.checkBody('address', 'Localização não é valida').notEmpty();

			//var latlong = req.body.lat + "," + req.body.lng;

			//req.check(latlong, 'Location is not valid').isLatLong();

			//const errors = validationResult(req);
			var errors = req.validationErrors();
			if (errors) {
				//res.send(errors);
				//res.send(req.file.path);
				res.render('pages/campaigns/create', {errors: errors, inputs: req.body});
				return;
				//return res.status(422).json({ errors: errors.mapped() });
			}
			mongoose.model('Campaign').create({
				owner: req.session.userID,
				title: req.body.title,
				description: req.body.description,
				isFunds: req.body.isFunds,
				goodsType: req.body.goodsType.toLowerCase(),
				goal: req.body.goal,
				endDate: req.body.endDate,
				lat: req.body.lat,
				lng: req.body.lng,
				loc: [req.body.lng, req.body.lat],
				address: req.body.address,
				location: req.body.location,
				image: req.file.path
			}, function (err, campaign) {
				if (err) {
					res.send('There was a problem adding the information to the database.\n' + err);
				} else {
					//Blob has been created
					console.log('POST creating new campaign: ' + campaign);
					res.format({
						//HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
						html: function () {
							// If it worked, set the header so the address bar doesn't still say /adduser
							res.location('campaigns');
							// And forward to success page
							res.redirect('/campaigns');
						},
						//JSON response will show the newly created blob
						json: function () {
							res.json(campaign);
						}
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

module.exports = router;
