process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var app = require('../../app');
//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');
const utils = require('./utils');

var globalID;
let globalCampaignID;
chai.use(chaiHttp);
//Our parent block


describe('Campaigns', () => {
	before((done) => { //Before tests
		mongoose.model('User').create({
			name: 'teste2',
			email: 'teste2@teste.teste',
			password: bcrypt.hashSync('123456', 10)
		}, (err, user) => {
			let ownerID = user._id;
			globalID = user._id;

			mongoose.model('Campaign').create({
				owner: ownerID,
				title: 'Example for testing',
				description: 'testing is fun',
				isFunds: true,
				goal: 100,
				endDate: new Date('2015-03-25'),
				lat: 41.157944,
				lng: -8.629105,
				loc: [41.157944, -8.629105],
				image: 'imagefile',
			}, (err,campaign) => {
				globalCampaignID = campaign._id;
				done();
			});
		});
	});

	describe('/POST signin user', () => {
		it('it should POST signin a user successfully', (done) => {
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			chai.request(app.server)
				.post('/users/signin')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});

	describe('/POST create campaign', () => {
		it('it should POST a campaign with correct data', (done) => {
			let campaign = {
				owner: globalID,
				title: 'Second Example for testing',
				description: 'testing is fun',
				isFunds: true,
				goal: 100,
				endDate: new Date('2015-03-25'),
				lat: 41.157944,
				lng: -8.629105,
				loc: [41.157944, -8.629105],
				image: 'imagefile',
			};
			utils.userLogin(function () {
				agent
					.post('/campaigns/create')
					.send(campaign)
					.end((err, res) => {
						res.text.should.contain('Example for testing');
						res.should.have.status(200);
					});
			});
			done();
		});

		it('it should not POST a campaign with incorrect data', (done) => {
			let badcampaign = {
				owner: globalID,
				title: 'Second Example for testing',
				description: 'testing is fun',
				isFunds: true,
				goal: 100,
				endDate: new Date('2015-03-25'),
				lat: 41.157944,
				lng: -8.629105,
				loc: [41.157944, -8.629105],
				image: 'imagefile',
			};
			agent = chai.request(app.server);
			utils.userLogin(function () {
				agent
					.post('/campaigns/create')
					.send(badcampaign)
					.end((err, res) => {
						res.text.should.contain('Example for testing');
						res.should.have.status(200);
						done();
					});
			});
			done();
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
					}
					res.should.have.status(200);
					res.text.should.contain('Example for testing');
					done();
				});
		});

		it('it should POST a campaign search with correct data and return such campaign', (done) => {
			let invalidValue = 'xxx';
			chai.request(app.server)
				.post('/campaigns/searchByTitle')
				.send(invalidValue)
				.end((err, res) => {
					if (err) {
						done(err);
					}
					res.should.have.status(200);
					res.text.should.contain('Example for testing');
					done();
				});
		});
	});

	describe('/POST donate to campaign', () => {
		it('it should POST a donation to campaign', (done) => {
			let url = '/campaign/'+ globalCampaignID +'/donate';
			let donation = {
				user : globalID,
				value : 200
			};
			chai.request(app.server)
				.post(url)
				.send(donation)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});