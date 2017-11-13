process.env.NODE_ENV = 'test';

/*var mongoose = require('mongoose');
var app = require('../test');
//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');


chai.use(chaiHttp);
//Our parent block

describe('Campaigns', () => {
	before((done) => {
		done();
	});
	describe('/POST create campaign', () => {
		it('it should POST a campaign with correct data', (done) => {
			let campaign = {
				title: 'Campaign for Testing',
				description: '123456',
				isFunds: true,
				goal: 300,
				endDate: '2018-01-01',
				lat: 12345,
				lng: 1234
			};
			chai.request(app.server)
				.post('/campaigns/create')
				.send(campaign)
				.end((err, res) => {
					if (err) {
						done(err);
					}
					;
					//res.should.have.status(200);
					done();
				});
		});

		it('it should POST a campaign with correct data', (done) => {
			let badcampaign = {*/
/*title: "Campaign for Testing",
description: "123456",
isFunds: true,
goal: 300,
endDate: "2018-01-01",
lat: 12345,
lng: 1234,
image: "test.png"*/
/*};
chai.request(app.server)
	.post('/campaigns/create')
	.send(badcampaign)
	.end((err, res) => {
		res.should.have.status(401);
		done();
	});
});
});*/

/*describe('/POST donate to campaign', () => {

	before(((done) => { //Before tests
			mongoose.model('Donation').create({
				name: 'teste2',
				campaign: 'teste_campaign',
				value: 10
			}, (err) => {
				done();
			});
		}),

		it('it should POST a donation to campaign', (done) => {
			let url = {
				//insert campaignID+/donate
			};
			let donation = {
				//donation
			};
			chai.request(app.server)
				.post(url)
				.send(donation)
				.end((err, res) => {
					res.should.have.status(200);
					done();

				});
		});
});*/
/*});*/