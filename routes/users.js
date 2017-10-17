var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Creates a new user */
router.post('/register', function(req, res, next) {

    var hash = bcrypt.hashSync(req.body.password, 10);

    mongoose.model('User').create({
        name : req.body.name,
        email : req.body.email,
        password : hash
    }, function (err, user) {
        if (err) {
            res.send("There was a problem adding the information to the database.\n" + err);
        } else {
            //Blob has been created
            console.log('POST creating new user: ' + user);
            res.format({
                //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                html: function(){
                    // Forward to success page
                    res.redirect("/");
                },
                //JSON response will show the newly created blob
                json: function(){
                    res.json(user);
                }
            });
        }
    });
});

module.exports = router;
