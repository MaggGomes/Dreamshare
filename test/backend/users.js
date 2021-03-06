process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var app = require('../../app');
//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');
var should = chai.should();
const utils = require('./utils');


var User = require('../../models/users');

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
	before((done) => { //Before tests
		mongoose.model('User').create({
			name: 'teste2',
			email: 'teste2@teste.teste',
			password: bcrypt.hashSync('123456', 10)
		}, (err) => {
			done();
		});
	});

	/*
	  * Test the /GET route
	  */
	describe('/POST register user', () => {
		it('it should POST a user successfully', (done) => {
			let user = {
				name: 'teste1',
				email: 'teste1@teste.teste',
				password: '123456'
			};
			chai.request(app.server)
				.post('/users/register')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
		it('it should not POST a user successfully with already used email', (done) => {
			let user = {
				name: 'newName',
				email: 'teste2@teste.teste',
				password: '123456'
			};
			chai.request(app.server)
				.post('/users/register')
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

		/*it('it should not POST a user successfully with already used username', (done) => {
			let user = {
				name: 'teste2',
				email: 'newEmail@teste.teste',
				password: '123456'
			};
			chai.request(app.server)
				.post('/users/register')
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});*/
	});

	/*
	* Test the /GET route
	*/
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

		it('it should not POST signin a user with wrong password', (done) => {
			let user = {
				email: 'teste2@teste.teste',
				password: '1234'
			};
			chai.request(app.server)
				.post('/users/signin')
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

		it('it should not POST signin a user that doesnt exist', (done) => {
			let user = {
				email: 'teste5@teste.teste',
				password: '123456'
			};
			chai.request(app.server)
				.post('/users/signin')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	describe('/POST logout user', () => {
		it('it should POST signin a user successfully', (done) => {
			chai.request(app.server)
				.post('/logout')
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});


	after(function (done){
		utils.clearAppState();
		done();
	});

});