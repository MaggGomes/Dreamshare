var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var reportSchema = Schema(
	{
		user: {type: Schema.Types.ObjectId, ref: 'User'},
		description: {type: String, required: true}
	}
);
mongoose.model('Report', reportSchema);