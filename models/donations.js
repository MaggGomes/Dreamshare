var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var donationSchema = Schema(
	{
		user: {type: Schema.Types.ObjectId, ref: 'User'},
		//campaign: {type: Schema.Types.ObjectId, ref: 'Campaign'},
		value: {type: Number, required: true, min: 0}
	}
);
mongoose.model('Donation', donationSchema);

exports.getDonationsByUser = function (userID, done){
	mongoose.model('Donation').find({user: userID}, function (err, donations) {
		if (err) return done(err);
		done(null, donations);
	});
};