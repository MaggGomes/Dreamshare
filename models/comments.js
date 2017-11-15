var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var commentSchema = Schema(
	{
		user: {type: Schema.Types.ObjectId, ref: 'User'},
		//campaign: {type: Schema.Types.ObjectId, ref: 'Campaign'},
		text: {type: String, required: true},
		date: {type: Date, default: Date.now},
		replies: [{type: Schema.Types.ObjectId, ref: 'Reply'}]
	}
);
mongoose.model('Comment', commentSchema);