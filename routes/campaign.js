var express = require('express');
var router = express.Router();

/* GET campaign page. */
router.get('/', function(req, res, next) {
  res.render('pages/campaign/index', { title: 'Express' });
});

/* GET campaign page. */
router.get('/create', function(req, res, next) {
    res.render('pages/campaign/create', { title: 'Express' });
});

module.exports = router;
