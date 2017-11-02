process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var User = require('../models/users');
var app = require('../test');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Campaigns', () => {
    before((done) => { //Before tests
        mongoose.model('User').create({
            name : "teste2",
            email : "teste2@teste.teste",
            password: bcrypt.hashSync("123456", 10)
        }, (err) => {
            done();
        });
    });

    describe('/POST create campaign', () => {
        it('it should not POST signin a user with wrong data', (done) => {
            let campaign = {
                owner: "teste2",
                title: "Campaign for Testing",
                description: "123456",
                isFunds: true,
                goal: 300,
                progress: 0,
                endDate: 2018-01-01,
                lat: 12345,
                lng: 1234,
                image: "test.png",
            }
            chai.request(app.server)
                .post('/campaigns/create')
                .send(campaign)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();

                });
        });
        });


});
