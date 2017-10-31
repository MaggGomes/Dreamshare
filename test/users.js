//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var User = require('../models/users');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
//var server = require('../dev');
var bcrypt = require('bcrypt');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    /*beforeEach((done) => { Before each test we empty the database
    User.remove({}, (err) => {
        done();
    });
});*/
/*
  * Test the /GET route
  */
describe('/POST user', () => {
    it('it should not POST a user successfully', (done) => {
    let user = {
        name : "teste",
        email : "teste@teste.teste",
        password : "kkkk"
    }
    chai.request('http://95.85.7.126:3001')
        .post('/users/register')
        .send(user)
        .end((err, res) => {
        res.should.have.status(400);
        done();
    });
    });
});
});