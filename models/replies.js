var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var replySchema = Schema(
	{
		user: {type: Schema.Types.ObjectId, ref: 'User'},
		//comment: {type: Schema.Types.ObjectId, ref: 'Comment'},
		text: {type: String, required: true},
		date: {type: Date, default: Date.now, required: true},
		removed: {type: Boolean, default: false, required: true}
	}
);
mongoose.model('Reply', replySchema);