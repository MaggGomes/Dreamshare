var mongoose = require('mongoose');
var app = require('../../app');
var User = require('../../models/users');
const chai = require('chai');

exports.clearAppState = function ()
{
	mongoose.connection.db.dropDatabase();
};

exports.userLogin = function (done)
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
			 done(err);
		});

};

exports.loginUser = function (email, password, callback)
{

	agent = chai.request.agent(app.server);
	agent
		.post('/users/signin')
		.send({email: email, password: password})
		.then(function (response, res)
		{
			if (response.ok)
			{
				callback(null, agent);
			}
			else
			{
				callback('Error authenticating user ', agent);
			}
		});
};

exports.userDonate = function (url, donation, agent, callback)
{
	agent
		.post(url)
		.send(donation)
		.end(function (err, res)
		{
			callback(err, res);
		});
};


exports.createCampaign = function (url, campaign, agent, callback)
{
	agent
		.post(url)
		.send(campaign)
		.end(function (err, res)
		{
			callback(err, res);
		});
};