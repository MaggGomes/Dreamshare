var mongoose = require('mongoose');
var app = require('../../app');

exports.clearAppState = function ()
{
    mongoose.connection.db.dropDatabase();
};