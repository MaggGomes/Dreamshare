var express = require('express');
var router = express.Router();

/* GET campaign page. */
router.get('/', function(req, res, next) {
    res.render('pages/edit_campaign', { title: 'Edit Campaign' });
});

module.exports = router;
