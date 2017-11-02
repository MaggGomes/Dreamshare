var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    fs = require('fs'),
    multer  = require('multer'),
    gm  = require('gm').subClass({imageMagick:true}),
    upload = multer({
        dest: 'images/campaigns/',
        fileFilter: function (req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'));
            }
            cb(null, true);
        }
    });


const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

/* GET campaigns page */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        userLogged = true;
    } else {
        userLogged = false;
    }

    mongoose.model('Campaign').find({}, function(err, campaigns) {
        if (err) throw err;

        console.log(campaigns);
        res.render('pages/campaigns/index', { campaigns: campaigns, userLogged: userLogged });
    }).limit(6);
});

/* GET campaigns page with search options */
router.get('/search/:isFunds*?/:searchType*?', function(req, res, next) {
    if (req.session.user) {
        userLogged = true;
    } else {
        userLogged = false;
    }

    mongoose.model('Campaign').find({isFunds : req.params.isFunds}, function(err, campaigns) {
        if (err) throw err;

        console.log(campaigns);
        res.render('pages/campaigns/index', { campaigns: campaigns, userLogged: userLogged });
    }).limit(6);
});

/* GET map campaigns page */
router.get('/map', function(req, res, next) {
    if (req.session.user) {
        userLogged = true;
    } else {
        userLogged = false;
    }

    mongoose.model('Campaign').find({}, function(err, campaigns) {
        if (err) throw err;

        console.log(campaigns);
        res.render('pages/campaigns/map', { campaigns: campaigns, userLogged: userLogged });
    });
});

// POST donate to campaign
router.post('/:campaignId/donate', function (req, res, next) {
    if (req.session.user) {
        mongoose.model('Donation').create({
            user: req.session.userID,
            campaign: req.params.campaignId, // campaign id
            value: req.body.amount
        }, function(err, donation) {
            if (err) {
                res.send("Donation failed.\n" + err);
            }
            else {
                // TODO: update page instead of reloading

                /**
                 * Update progress value
                 */
                mongoose.model('Donation').find({campaign: req.params.campaignId}, function(err, donations) {
                    var progress = 0;
                    if (err) throw err;
                    for (var i = 0; i < donations.length; i++) {
                        progress += donations[i].value;
                    }
                    mongoose.model('Campaign').update({_id: req.params.campaignId}, {$set: {progress: progress}}, function(err, campaign) {
                        if (err) throw err;
                    });
                });

                res.format({
                    html: function(){
                        res.location("/campaigns/" + req.params.campaignId);
                        res.redirect("/campaigns/" + req.params.campaignId);
                    }
                });
            }
        });
    } else {
        res.status(400).send('400');
    }
});

/* GET create campaign page */
router.get('/create', function(req, res, next) {
    var errors;
    if (req.session.user) {
        res.render('pages/campaigns/create', { userLogged: true , errors: errors});
    } else {
        res.status(403);
    }
});

// POST create campaign
router.post('/create',
    upload.single('imageFile'), function (req, res, next) {
        if (req.session.user) {

            req.checkBody('title', 'Title is required').notEmpty();
            req.checkBody('title', 'Title is too Short').isLength({min: 5});
            req.checkBody('title', 'Title is too Long').isLength({max: 100});
            req.checkBody('description', 'Description is required').notEmpty().isLength({min: 25});
            req.checkBody('description', 'Description is too Short').isLength({min: 25});
            req.checkBody('description', 'Description is too Long').isLength({max: 250});
            req.checkBody('isFunds', 'Type of Funds is required').notEmpty();
            req.checkBody('goal', 'Campaign must have a goal higher than 0').notEmpty().isInt({min: 0});
            req.checkBody('endDate', 'endDate must not be empty').notEmpty();
            req.checkBody('lat', 'latitude must not be empty').notEmpty();
            req.checkBody('lng', 'longitude must not be empty').notEmpty();

            var latlong = req.body.lat + "," + req.body.lng;

            check(latlong, 'Combination of latitude and longitude is not valid').isLatLong();

            //const errors = validationResult(req);
            var errors = req.validationErrors();
            if (errors) {
                //res.send(errors);
                res.render('pages/campaigns/create', {errors:errors});
                return;
                //return res.status(422).json({ errors: errors.mapped() });
            }
            gm(req.file.path)
                .resize(300,200)
                .noProfile()
                .write('images/campaigns/testeresize', function (err) {
                    if (!err) console.log('done');
                });
            mongoose.model('Campaign').create({
                owner : req.session.userID,
                title : req.body.title,
                description : req.body.description,
                isFunds : req.body.isFunds,
                goodsType : req.body.goodsType.toLowerCase(),
                goal : req.body.goal,
                endDate : req.body.endDate,
                lat : req.body.lat,
                lng: req.body.lng,
                image:  req.file.path
            }, function (err, campaign) {
                if (err) {
                    res.send("There was a problem adding the information to the database.\n" + err);
                } else {
                    //Blob has been created
                    console.log('POST creating new campaign: ' + campaign);
                    res.format({
                        //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                        html: function(){
                            // If it worked, set the header so the address bar doesn't still say /adduser
                            res.location("campaigns");
                            // And forward to success page
                            res.redirect("/campaigns");
                        },
                        //JSON response will show the newly created blob
                        json: function(){
                            res.json(campaign);
                        }
                    });
                }
            });
        } else {
            res.status(403);
        }
    });


/* POST get more campaigns */
router.post('/more', function(req, res, next) {
    mongoose.model('Campaign').find({"_id" :{"$nin" : req.body.existingCampaigns}}, function(err, campaigns) {
        if (err) throw err;
        console.log(campaigns);
        res.status(200).send(campaigns);
    }).limit(parseInt(req.body.nCampaigns));
});


/* GET show campaign page */
router.get('/:campaignId', function(req, res, next) {
    if (req.session.user) {
        userLogged = true;
    } else {
        userLogged = false;
    }

    mongoose.model('Campaign').find({"_id" : req.params.campaignId}, function(err, campaigns) {
        if (err) {
            res.location("/campaigns");
            res.redirect("/campaigns");
            throw err;
        }
        var campaign = campaigns[0];
        mongoose.model('Donation').find({"campaign": req.params.campaignId}).populate('user', 'name').exec(function(err, donations) {
            if (err) {
                res.location("/campaigns");
                res.redirect("/campaigns");
                throw err;
            }

            // Get donations
            campaign.donated = 0;
            campaign.donations = [];
            var donators = [];
            for (var i = 0; i < donations.length; i++) {
                campaign.donated += donations[i].value;
                campaign.donations.push({userId: donations[i].user.name, value: donations[i].value});
                donators.push(donations[i].user);
            }
            campaign.n_donators = donators.map(function(e) {return e.toString();}).filter(function(item, pos, self) {return self.indexOf(item) == pos;}).length;

            // Get time remaining
            var curr_t = new Date();
            var end_t = new Date(campaign.endDate);
            var year_dif = end_t.getFullYear() - curr_t.getFullYear();
            var month_dif = end_t.getMonth() - curr_t.getMonth();
            var day_dif = end_t.getDate() - curr_t.getDate();
            var hour_dif = end_t.getHours() - curr_t.getHours();
            var minute_dif = end_t.getMinutes() - curr_t.getMinutes();

            if (end_t.getTime() < curr_t.getTime()) {
                campaign.closed = true;
            }
            else if (year_dif > 0) {
                campaign.remaining = year_dif;
                year_dif === 1 ? campaign.remaining += " ano" : campaign.remaining += " anos";
            }
            else if (month_dif > 0) {
                campaign.remaining = month_dif;
                month_dif === 1 ? campaign.remaining += " mês" : campaign.remaining += " meses";
            }
            else if (day_dif > 0) {
                campaign.remaining = day_dif;
                day_dif === 1 ? campaign.remaining += " dia" : campaign.remaining += " dias";
            }
            else if (hour_dif > 0) {
                campaign.remaining = hour_dif;
                hour_dif === 1 ? campaign.remaining += " hora" : campaign.remaining += " horas";
            }
            else if (minute_dif > 0) {
                campaign.remaining = minute_dif;
                minute_dif === 1 ? campaign.remaining += " minuto" : campaign.remaining += " minutos";
            }
            else {
                campaign.remaining = "< 1 minuto";
            }

            // Get comments

            res.render('pages/campaigns/show', { userLogged: userLogged, campaign: campaign});
        });
    });
});

/* GET edit campaign page */
router.get('/:campaignId/edit', function(req, res, next) {
    res.render('pages/campaigns/edit', { title: 'Edit Campaign' });
});

module.exports = router;
