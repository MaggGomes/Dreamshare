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
		it('it should not POST a donation to campaign if user is not logged in', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/donate';
			let donation = {
				user: globalID,
				value: 200
			};
			agent = chai.request(app.server)
				.post(url)
				.send(donation)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

		it('it should POST a donation to a valid campaign', (done) => {
			let url = '/campaigns/'+ globalCampaignID +'/donate';
			let donation = {
				user : globalID,
				value: 200
			};
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			utils.loginUser(user.email, user.password, function (err, agent)
			{
				utils.userDonate(url, donation, agent, function (err, res)
				{
					res.should.have.status(200);
					done();
				});
			});

		});

		/*        it('it should POST a donation to campaign', (done) => {

            let fakeUrl = '/campaigns/5a3211f8c0c1917966dc9224/donate';
            let donation = {
                user : globalID,
                value : 200
            };
            let user = {
                email: 'teste2@teste.teste',
                password: '123456'
            };
            utils.loginUser(user.email, user.password, function (err, agent)
            {
                utils.userDonate(fakeUrl, donation, agent, function (err, res)
                {
                    res.should.have.status(400);
                    done();
                });
            });

        });*/
	});

	describe('/GET  campaigns', () => {
		before((done) => { //Before tests
			mongoose.model('User').create({
				name: 'teste3',
				email: 'teste3@teste.teste',
				password: bcrypt.hashSync('123456', 10)
			}, (err) => {
				done();
			});
		});

		it('it should GET a campaign when parsed correct ID', (done) => {
			chai.request(app.server)
				.get('/campaigns/'+ globalCampaignID)
				.end((err, res) => {
					if (err) {
						done(err);
					}
					res.should.have.status(200);
					res.text.should.contain('Example for testing');
					done();
				});
		});

		it('it should GET a campaign when parsed correct ID and signed in', (done) => {
			let user = {
				email: 'teste3@teste.teste',
				password: '123456'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.get('/campaigns/' + globalCampaignID)
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

		it('it should GET a campaign when parsed correct ID and signed in as owner', (done) => {
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.get('/campaigns/' + globalCampaignID)
					.end((err, res) => {
						if (err) {
							done(err);
						}
						res.should.have.status(200);
						res.text.should.contain('id="saveBtn"');
						done();
					});
			});

		});

		it('it should GET a campaign when parsed correct ID and signed in as user without priveledges', (done) => {
			let user = {
				email: 'teste3@teste.teste',
				password: '123456'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.get('/campaigns/' + globalCampaignID)
					.end((err, res) => {
						if (err) {
							done(err);
						}
						res.should.have.status(200);
						res.text.should.not.contain(' id="saveBtn" ');
						done();
					});
			});

		});
	});

	after(function (done){
		utils.clearAppState();
		done();
	});
});