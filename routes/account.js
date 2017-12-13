var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


/* GET account home page. */
router.get('/', function (req, res, next) {
	if (req.session.user) {
		userLogged = true;
	} else {
		userLogged = false;
	}

	res.render('dasdsa', {userLogged: userLogged});
});

module.exports = router;