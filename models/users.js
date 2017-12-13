var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = Schema(
	{
		name: {type: String, required: true, max: 100},
		email: {type: String, required: true, unique: true, max: 100},
		password: {type: String},
		lat: {type: Number},
		lng: {type: Number},
		photo: {type: String},
		isAdmin: {type: Boolean, required: true, default: false},
		reports: [{type: Schema.Types.ObjectId, ref: 'Report'}]
	}
);

mongoose.model('User', userSchema);

exports.getCoords = function (userID, done) {
	mongoose.model('User').findById(userID, 'lat lng', function (err, coords) {
		if (err) return done(err);
		if(typeof coords.lat === 'undefined' || typeof coords.lng === 'undefined') {
			var error = {
				message : 'Location undefined',
				name : 'LocationUndefined'
			};
			return done(error);
		};
		done(null, coords);
	});
};

exports.getAllUsers = function (done) {
	mongoose.model('User').find( {}, function (err, users) {
		if (err) return done(err);
		done(null, users);
	});
};

exports.getReportedUsers = function (done) {
	mongoose.model('User').find( { $where : 'this.reports && this.reports.length > 0' }, function (err, users) {
		if (err) return done(err);
		done(null, users);
	});
};

exports.getAllUsersToday = function (done){
	mongoose.model('User').find({'_id' : { '$gt' : ObjectId(Math.floor(new Date().getTime()/1000).toString(16)+'0000000000000000') }}, function (err, users) {
		if (err) return done(err);
		done(null, users);
	});
};