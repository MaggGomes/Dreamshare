var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var commentSchema = Schema(
	{
		user: {type: Schema.Types.ObjectId, ref: 'User'},
		//campaign: {type: Schema.Types.ObjectId, ref: 'Campaign'},
		text: {type: String, required: true},
		date: {type: Date, default: Date.now},
		replies: [{type: Schema.Types.ObjectId, ref: 'Reply'}],
		removed: {type: Boolean, default: false, required: true},
		reports: [{type: Schema.Types.ObjectId, ref: 'Report'}]
	}
);
mongoose.model('Comment', commentSchema);


exports.getAllComments = function (done) {
	mongoose.model('Comment').find({}, function (err, comments) {
		if (err) return done(err);
		done(null, comments);
	});
};


exports.getReportedComments = function (done) {
	mongoose.model('Comment').find( { $where : 'this.reports && this.reports.length > 0' }, function (err, comments) {
		if (err) return done(err);
		done(null, comments);
	});
};

