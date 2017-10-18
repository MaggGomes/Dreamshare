var express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        userLogged = true;
    } else {
        userLogged = false;
    }

    mongoose.model('Campaign').find({isFunds : true}, function(err, fundsCampaigns) {
        if (err) throw err;
        mongoose.model('Campaign').find({isFunds : false}, function(err, goodsCampaigns) {
            if (err) throw err;
            res.render('pages/index', { fundsCampaigns : fundsCampaigns, goodsCampaigns: goodsCampaigns, userLogged: userLogged });
        }).limit(3);
    }).limit(3);
});

/* GET admin home page. */
router.get('/admin', function(req, res, next) {
    if (req.session.user) {
        userLogged = true;
    } else {
        userLogged = false;
    }

    res.render('admin/index', { userLogged: userLogged });
});

/* GET campaigns page */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        userLogged = true;
    } else {
        userLogged = false;
    }

    mongoose.model('Campaign').find({"isFunds" :{"$in" : req.body.existingCampaigns}}, function(err, campaigns) {
        if (err) throw err;

        console.log(campaigns);
        res.render('pages/index', { campaigns: campaigns, userLogged: userLogged });
    }).limit(3);
});


module.exports = router;
