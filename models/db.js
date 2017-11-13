var mongoose = require('mongoose');
var Config = require('../config'),
	config = new Config();

mongoose.connect('mongodb://' + config.db_address + '/' + config.db_name + '', {useMongoClient: true});
