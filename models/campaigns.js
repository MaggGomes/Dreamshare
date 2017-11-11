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
        image: {type: String, required: true},
    }
);

mongoose.model('Campaign', campaignSchema);

exports.getInsideCoords = function(lat_left, lat_right, lng_up, lng_down, done) {
    mongoose.model('Campaign').find({
            "lat":{"$lte": lat_left, "$gte": lat_right},
            "lng":{"$lte": lng_up, "$gte": lng_down}
        },
        function(err, campaigns) {
            if(err) return done(err)
            done(null, campaigns)
        });
}