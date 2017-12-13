var mongoose = require('mongoose');
var app = require('../../app');
var User = require('../../models/users');
const chai = require('chai');

exports.clearAppState = function ()
{
	mongoose.connection.db.dropDatabase();
};

exports.userLogin = function ()
{
	let user={
		email: 'teste2@teste.teste',
		password: '123456'
	};
	agent = chai.request(app.server);
	agent
		.post('/signin')
		.send(user)
		.end((err, res) => {
			res.should.have.status(200);
			// done(err);
		});

};
