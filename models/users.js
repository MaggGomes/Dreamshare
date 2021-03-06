var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = Schema(
	{
		name: {type: String, required: true, max: 100},
		email: {type: String, required: true, unique: true, max: 100},
		password: {type: String},
		genre: {type: String},
		lat: {type: Number},
		lng: {type: Number},
		address: {type: String},
		location: {type: String},
		birthdate: {type: Date},
		biography: {type: String},
		photo: {type: String},
		isAdmin: {type: Boolean, required: true, default: false},
		reports: [{type: Schema.Types.ObjectId, ref: 'Report'}],
		status: {type: String, enum : ['ACTIVE','DEACTIVATED', 'MODERATED', 'REMOVED'], default: 'ACTIVE'}
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

exports.getUser = function (id, done){
	mongoose.model('User').findById(id, function (err, user) {
		if (err) return done(err);
		done(null, user);
	});
};

exports.updateUser = function (id, email, password, name, genre, lat, lng, address, location, birthdate, biography, photo, done){
	mongoose.model('User').findById(id, function (err, user) {
		if (err) return done(err);

		if(email){user.email = email;}
		if(password){user.password = password;}
		if(name){user.name = name;}
		if(genre){user.genre = genre;}
		if(lat){user.lat = lat;}
		if(lng){user.lng = lng;}
		if(address){user.address = address;}
		if(location){user.location = location;}
		if(birthdate){user.birthdate = birthdate;}
		if(biography){user.biography = biography;}
		if(photo){user.photo = photo;}
		user.save(function (err, updatedUser) {
			if (err) return done(err);
			done(null, updatedUser);
		});
	});
};

exports.updateUserStatus = function (id, status, done){
	mongoose.model('User').findById(id, function (err, user) {
		if (err) return done(err);

		user.status = status;

		user.save(function (err, updatedUser) {
			if (err) return done(err);
			done(null, updatedUser);
		});
	});
};