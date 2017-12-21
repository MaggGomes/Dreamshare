process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var app = require('../../app');
//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');
const utils = require('./utils');


chai.use(chaiHttp);
//Our parent block
let globalagent;

describe('Admins', () => {
	beforeEach((done) => { //Before tests
		mongoose.model('User').create({
			name: 'admin',
			email: 'admin',
			password: bcrypt.hashSync('feupadmin', 10),
			isAdmin : true
		});
		done();
	});

	describe('/GET  admin', () => {
		it('it should GET admin all comments', (done) => {
			let url = '/admin/comments';
			agent = chai.request(app.server);
			agent
				.get(url)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});

		it('it should GET admin all campaigns', (done) => {
			let url = '/admin/campaigns';
			agent = chai.request(app.server);
			agent
				.get(url)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});

		});

		it('it should GET admin all users', (done) => {
			let url = '/admin/users';
			agent = chai.request(app.server);
			agent
				.get(url)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});


	after(function(done){
		utils.clearAppState();
		done();
	});


});