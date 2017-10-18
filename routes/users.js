var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

/* Sign in user */
router.post('/signin', function(req, res, next) {
    mongoose.model('User').findOne({email: req.body.email}, function(err, user){
        if (err) {
            next(err);
        } else {
            if (!user) {
                res.send('401');
            } else {
                if(bcrypt.compareSync(req.body.password, user.password)) {
                    req.session.user = user.name;
                    req.session.email = user.email;
                    req.session.userID = user._id;
                    res.send('200');
                } else {
                    res.send('400');
                }
            }
        }
    });
});

/* Sign in user */
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
});

/* Creates a new user */
router.post('/register', function(req, res, next) {

   /* req.sanitize('name').escape();
    req.sanitize('name').trim();

    var errors = req.validationErrors();

    if (errors) {

    }*/

    var hash = bcrypt.hashSync(req.body.password, 10);

    mongoose.model('User').create({
        name : req.body.name,
        email : req.body.email,
        password : hash
    }, function (err, user) {
        if (err) {
            res.send('400');
        } else {
            res.send('200');
        }
    });
});

module.exports = router;
