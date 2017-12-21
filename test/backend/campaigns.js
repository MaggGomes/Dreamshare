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
				comments: []
			}, (err,campaign) => {
				globalCampaignID = campaign._id;
			});
		});
		mongoose.model('User').create({
			name: 'teste3',
			email: 'teste3@teste.teste',
			password: bcrypt.hashSync('123456', 10)
		});
		done();
	});

	describe('/POST create campaign', () => {
		it('it should not POST a campaign with no user logged in', (done) => {
			let url = '/campaigns/create';
			let campaign = {
				owner: globalID,
				title: 'Second Example for testing',
				description: 'testing is fun and the description needs to have at least 25 characters',
				isFunds: true,
				goal: 100,
				endDate: new Date('2015-03-25'),
				lat: 41.157944,
				lng: -8.629105,
				loc: [41.157944, -8.629105],
				address:'example adress',
				image: 'imagefile',
			};
			agent = chai.request(app.server);
			agent
				.post(url)
				.send(campaign)
				.end((err, res) => {
					res.should.have.status(400);
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
					}
					res.should.have.status(200);
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

		it('it should POST a donation to a valid campaign if logged in', (done) => {
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
	});

	describe('/GET  campaigns', () => {
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

	describe('/GET edit campaign', () => {
		it('it should GET campaign edit page', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/edit';
			agent = chai.request(app.server)
				.get(url)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
		it('it should GET campaign edit page when a user is logged in', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/edit';
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.get(url)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});


	describe('/POST report campaign', () => {
		it('it should not POST a report to a campaign when not logged in', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/report';
			agent = chai.request(app.server)
				.post(url)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

		it('it should POST a report to a campaign when logged in', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/report';
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			let report = {
				user: globalID,
				description: 'this is meant for test purposes'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.post(url)
					.send(report)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});


		it('it should not POST a report to a campaign with missing or invalid report(missing)', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/report';
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.post(url)
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
		});

		it('it should not POST a report to a campaign with missing or invalid report (invalid)', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/report';
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			let report = {
				user: 'IDONTEXIST',
				description: 'this is meant for test purposes'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.post(url)
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
		});
	});


	describe('/DELETE a campaign', () => {
		it('it should not DELETE a campaign when not logged in', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/delete';
			agent = chai.request(app.server)
				.delete(url)
				.end((err, res) => {
					res.should.have.status(403);
					done();
				});
		});

		it('it should DELETE a campaign when logged in', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/delete';
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.delete(url)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});

		it('it should NOT DELETE a campaign that doesnt exist', (done) => {
			let url = '/campaigns/' + 'fakeid' + '/delete';
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.delete(url)
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
		});
	});


	describe('/POST a comment at a campaign', () => {
		it('it should not POST a comment to a campaign when not logged in', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/comment';
			let comment = {
				user: globalID,
				text: 'This is the text of the comment'
			};
			agent = chai.request(app.server)
				.post(url)
				.send(comment)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

		it('it should not POST an invalid comment to a campaign when logged in', (done) => {
			let url = '/campaigns/' + globalCampaignID + '/comment';
			let comment = {
				user: globalID,
			};
			let user = {
				email: 'teste2@teste.teste',
				password: '123456'
			};
			agent = chai.request(app.server);
			utils.loginUser(user.email, user.password, function (err, agent) {
				agent
					.post(url)
					.send(comment)
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
		});

	});


	after(function(done){
		utils.clearAppState();
		done();
	});


});