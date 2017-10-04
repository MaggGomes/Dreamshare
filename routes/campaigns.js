var express = require('express');
var router = express.Router();

/* GET campaign page. */
router.get('/', function(req, res, next) {
    res.render('pages/campaigns', { title: 'Campaigns' });
});

module.exports = router;
