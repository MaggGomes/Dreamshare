var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    multer  = require('multer'),
    upload = multer({
        dest: 'images/campaigns/',
        fileFilter: function (req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'));
            }
            cb(null, true);
        }
    });

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
                res.format({
                    html: function(){
                        res.location("/campaigns/" + req.params.campaignId);
                        res.redirect("/campaigns/" + req.params.campaignId);
                    }
                });
            }
        });
    } else {
        res.send('400');
    }
});

/* GET create campaign page */
router.get('/create', function(req, res, next) {
    if (req.session.user) {
        res.render('pages/campaigns/create', { userLogged: true });
    } else {
        res.send('400');
    }
});

// POST create campaign
router.post('/create', upload.single('imageFile'), function (req, res, next) {
    if (req.session.user) {
        mongoose.model('Campaign').create({
            owner : req.session.userID, //TODO buscar id do user da session
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
        res.send('400');
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
        mongoose.model('Donation').find({"campaign": req.params.campaignId}, function(err, donations) {
            if (err) {
                res.location("/campaigns");
                res.redirect("/campaigns");
                throw err;
            }

            campaign.donated = 0;
            campaign.donations = [];
            var donators = [];
            for (var i = 0; i < donations.length; i++) {
                campaign.donated += donations[i].value;
                campaign.donations.push({userId: donations[i].user, value: donations[i].value});
                donators.push(donations[i].user);
            }
            campaign.n_donators = donators.map(function(e) {return e.toString();}).filter(function(item, pos, self) {return self.indexOf(item) == pos;}).length;

            res.render('pages/campaigns/show', { userLogged: userLogged, campaign: campaign});
        });
    });
});

/* GET edit campaign page */
router.get('/:campaignId/edit', function(req, res, next) {
    res.render('pages/campaigns/edit', { title: 'Edit Campaign' });
});

module.exports = router;
