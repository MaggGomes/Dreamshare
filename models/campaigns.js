var mongoose = require('mongoose');

var campaignSchema = mongoose.Schema(
    {
        title: {type:String, required: true, max:100},
        description: {type:String, required: true, max: 250},
        isFunds: Boolean,
        endDate: {type: Date},
        location: {type: String, required:true, max:100}
    }
);
mongoose.model('Campaign', campaignSchema);