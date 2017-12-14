var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectID = require('mongodb').ObjectID;

var campaignSchema = Schema(
	{
		owner: {type: Schema.Types.ObjectId, ref: 'User'},
		title: {type: String, required: true, max: 100},
		description: {type: String, required: true, max: 250},
		isFunds: {type: Boolean, required: true},
		goodsType: {type: String},
		goal: {type: Number, min: 0, required: true},
		progress: {type: Number, min: 0, default: 0},
		endDate: {type: Date, required: true},
		lat: {type: Number, required: true},
		lng: {type: Number, required: true},
		loc : { type: [Number], index: '2dsphere' },
		address: {type: String},//, required: true},
		location: {type: String},//, required: true},
		image: {type: String, required: true},
		comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
		avgTimeDonations: {type: Number, min: 0, default: 0},
		donations: [{type: Schema.Types.ObjectId, ref: 'Donation'}],
		reports: [{type: Schema.Types.ObjectId, ref: 'Report'}]
	});

mongoose.model('Campaign', campaignSchema);

exports.getInsideCoords = function (lat_left, lat_right, lng_up, lng_down, done) {
	mongoose.model('Campaign').find({
		'lat': {'$lte': lat_left, '$gte': lat_right},
		'lng': {'$lte': lng_up, '$gte': lng_down}
	}, function (err, campaigns) {
		if (err) return done(err);
		done(null, campaigns);
	});
};


exports.getTrending = function (nCampaigns, done) {
	var variavel = 2;

	mongoose.model('Campaign').aggregate(
		{$match: {}},
		{$project: {
			owner: 1,
			title: 1,
			description: 1,
			isFunds: 1,
			goodsType: 1,
			goal: 1,
			progress: 1,
			endDate: 1,
			lat: 1,
			lng: 1,
			address: 1,
			location: 1,
			image: 1,
			comments: 1,
			avgTimeDonations: 1,
			donations: 1,
			trendFactor: {$size: { '$ifNull': [ '$donations', [] ] }}
		}},
		{ $sort: { trendFactor: -1 } },
		{ $limit: nCampaigns },

		function (err, campaigns) {
			if (err) return done(err);
			done(null, campaigns);
		}
	);
};

exports.getTrendingWithCoords = function (nCampaigns, lat, lng, done) {
	var variavel = 2;

	mongoose.model('Campaign').aggregate(
		{$geoNear: {
			near: { type: 'Point', coordinates: [lng, lat ] },
			distanceField: 'dist',
			spherical: true
		}},
		{$project: {
			owner: 1,
			title: 1,
			description: 1,
			isFunds: 1,
			goodsType: 1,
			goal: 1,
			progress: 1,
			endDate: 1,
			lat: 1,
			lng: 1,
			address: 1,
			location: 1,
			image: 1,
			comments: 1,
			avgTimeDonations: 1,
			donations: 1,
			dist: 1,
			trendFactor: {$multiply: [{$size: { '$ifNull': [ '$donations', [] ] }}, { $divide: [1, '$dist']}] }
		}},
		{ $sort: { trendFactor: -1 } },
		{ $limit: nCampaigns },

		function (err, campaigns) {
			if (err) return done(err);
			done(null, campaigns);
		}
	);
};

exports.getMostContributed = function(done){
	mongoose.model('Campaign').aggregate(
		{$project: {
			owner: 1,
			title: 1,
			description: 1,
			isFunds: 1,
			goodsType: 1,
			goal: 1,
			progress: 1,
			endDate: 1,
			lat: 1,
			lng: 1,
			address: 1,
			location: 1,
			image: 1,
			comments: 1,
			donations : 1,
			avgTimeDonations: 1,
			Ndonations: {$size: '$donations'},
			dist: 1,
		}},
		{ $sort: { Ndonations: -1 }},
		function (err, campaigns) {
			if (err) return done(err);
			done(campaigns);
		}
	);
};

exports.getAllCampaigns = function (done) {
	mongoose.model('Campaign').find({}, function (err, campaigns) {
		if (err) return done(err);
		done(null, campaigns);
	});
};


exports.getReportedCampaigns = function (done) {
	mongoose.model('Campaign').find( { $where : 'this.reports && this.reports.length > 0' }, function (err, campaigns) {
		if (err) return done(err);
		done(null, campaigns);
	});
};

