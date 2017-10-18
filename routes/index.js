var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        userLogged = true;
    } else {
        userLogged = false;
    }

    res.render('pages/index', { userLogged: userLogged });
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

/* GET admin home page. */
router.get('/admin/users', function(req, res, next) {
    if (req.session.user) {
        userLogged = true;
    } else {
        userLogged = false;
    }

    res.render('admin/users', { userLogged: userLogged });
});

module.exports = router;
