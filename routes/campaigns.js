var express = require('express');
var router = express.Router();

/* GET campaigns page */
router.get('/', function(req, res, next) {
    res.render('pages/campaigns/index', { title: 'Campaigns' });
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
    res.send('Falta implementar este post, req.body esta a chegar vazio...');
})

/* GET edit campaign page */
router.get('/:campaignId(\\d+)/edit', function(req, res, next) {
    res.render('pages/campaigns/edit', { title: 'Edit Campaign' });
});

module.exports = router;
