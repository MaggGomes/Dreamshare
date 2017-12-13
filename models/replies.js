var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var replySchema = Schema(
	{
		user: {type: Schema.Types.ObjectId, ref: 'User'},
		//comment: {type: Schema.Types.ObjectId, ref: 'Comment'},
		text: {type: String, required: true},
		date: {type: Date, default: Date.now, required: true},
		removed: {type: Boolean, default: false, required: true},
		reports: [{type: Schema.Types.ObjectId, ref: 'Report'}]
	}
);
mongoose.model('Reply', replySchema);

exports.getAllReplies = function (done) {
	mongoose.model('Reply').find({}, function (err, replies) {
		if (err) return done(err);
		done(null, replies);
	});
};


exports.getReportedReplies = function (done) {
	mongoose.model('Reply').find( { $where : 'this.reports && this.reports.length > 0' }, function (err, replies) {
		if (err) return done(err);
		done(null, replies);
	});
};

