var mongoose = require('mongoose');
var Config = require('../config'),
	config = new Config();

mongoose.connect('mongodb://' + config.db_address + '/dreamshare', {useMongoClient: true});
