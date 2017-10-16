var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var campaignSchema = Schema(
    {
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        title: {type: String, required: true, max:100},
        description: {type: String, required: true, max: 250},
        isFunds: {type: Boolean, required: true},
        goodsType: {type: String},
        goal: {type: Number, min:0, required: true},
        progress: {type: Number, min:0, default: 0},
        endDate: {type: Date, required: true,},
        lat: {type: Number, required: true},
        lng: {type: Number, required: true},
    }
);
mongoose.model('Campaign', campaignSchema);