var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});

/* GET admin home page. */
router.get('/admin', function(req, res, next) {
    res.render('admin/index', { title: 'Express' });
});

/* GET admin home page. */
router.get('/admin/users', function(req, res, next) {
    res.render('admin/users', { title: 'Express' });
});

module.exports = router;
