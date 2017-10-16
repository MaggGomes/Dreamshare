var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var donationSchema = Schema(
    {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        campaign: {type: Schema.Types.ObjectId, ref: 'Campaign'},
        value: {type: Number, required: true},
    }
);
mongoose.model('Donation', donationSchema);