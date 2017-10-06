var express = require('express');
var router = express.Router();

/* GET campaign page. */
router.get('/', function(req, res, next) {
    res.render('pages/add_campaign', { title: 'Express' });
});

module.exports = router;
