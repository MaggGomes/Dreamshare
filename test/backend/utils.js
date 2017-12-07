var mongoose = require('mongoose');
var app = require('../../app');
var User = require('../../models/users');

exports.clearAppState = function ()
{
    mongoose.connection.db.dropDatabase();
};

exports.userLogin = function (email, password)
{
    chai.request(app.server)
    .post('/users/signin')
    .send({email: email, password: password})
    .end((err, res) => {
        if(err != null){
            console.log(err);
        }
        else console.log("Logged");
    });
};