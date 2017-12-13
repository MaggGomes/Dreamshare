process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var app = require('../../app');
//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');



chai.use(chaiHttp);
//Our parent block

describe('Campaigns',() => {
	before((done) => { //Before tests
		mongoose.model('User').create({
			name: 'teste2',
			email: 'teste2@teste.teste',
			password: bcrypt.hashSync('123456', 10)
		}, (err, user) => {
			let ownerID = user._id;

			mongoose.model('Campaign').create({
				owner: ownerID,
				title: 'Example for testing',
				description: 'testing is fun',
				isFunds: true,
				goal: 69,
				endDate:new Date('2015-03-25'),
				lat: 41.157944,
				lng: -8.629105,
				loc : [41.157944,-8.629105],
				image: 'imagefile',
			}, (err) => {
				done();
			});
		});
	});



	describe('/POST search campaign', () => {
		it('it should POST a campaign search with correct data and return such campaign', (done) => {
			let searchValue = 'testing';
			chai.request(app.server)
				.post('/campaigns/searchByTitle')
				.send(searchValue)
				.end((err, res) => {
					if (err) {
						done(err);
					};
					res.should.have.status(200);
					//add text.should
					done();
				});
		});
	});
	/*
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
				let badcampaign = {
					title: "Campaign for Testing",
					description: "123456",
					isFunds: true,
					goal: 300,
					endDate: "2018-01-01",
					lat: 12345,
					lng: 1234,
					image: "test.png"
				};
				chai.request(app.server)
					.post('/campaigns/create')
					.send(badcampaign)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});

		describe('/POST donate to campaign', () => {

			before((done) => { //Before tests
					mongoose.model('Donation').create({
						name: 'teste2',
						campaign: 'teste_campaign',
						value: 10
					}, (err) => {
						done();
					});
				});

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
});

