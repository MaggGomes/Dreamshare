var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');


/* GET campaigns page */
router.get('/', function(req, res, next) {
    mongoose.model('Campaign').find({}, function(err, campaigns) {
        if (err) throw err;

        console.log(campaigns);
        res.render('pages/campaigns/index', { campaigns: campaigns });
    });
});

/* GET show campaign page */
router.get('/:campaignId(\\d+)', function(req, res, next) {

    res.render('pages/campaigns/show', { title: 'Express' });
});

/* GET create campaign page */
router.get('/create', function(req, res, next) {
    res.render('pages/campaigns/create', { title: 'Express' });
});

// POST create campaign
router.post('/create', function (req, res, next) {
    console.log(req.body);
    mongoose.model('Campaign').create({
        title : req.body.title,
        isFunds : req.body.type,
        description : req.body.description,
        qtd : req.body.qtd,
        endDate : req.body.endDate,
        location : req.body.location
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
})

/* GET edit campaign page */
router.get('/:campaignId(\\d+)/edit', function(req, res, next) {
    res.render('pages/campaigns/edit', { title: 'Edit Campaign' });
});

module.exports = router;
