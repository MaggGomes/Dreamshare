var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = Schema(
	{
		name: {type: String, required: true, max: 100},
		email: {type: String, required: true, unique: true, max: 100},
		password: {type: String},
		lat: {type: Number},
		lng: {type: Number},
		photo: {type: String}
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