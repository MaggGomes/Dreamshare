process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var app = require('../test');
//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block

describe('Campaigns', () => {
    before((done) => {
        done();
    });
    describe('/POST create campaign', () => {
        it('it should POST a campaign with correct data', (done) => {
            let campaign = {
                title: "Campaign for Testing",
                description: "123456",
                isFunds: true,
                goal: 300,
                endDate: "2018-01-01",
                lat: 12345,
                lng: 1234
            };
            chai.request(app.server)
                .post('/campaigns/create')
                .send(campaign)
                .end((err, res) => {
                if(err) {done(err)};
                    //res.should.have.status(200);
                    done();
                });
        });

        it('it should POST a campaign with correct data', (done) => {
            let badcampaign = {
                /*title: "Campaign for Testing",
                description: "123456",
                isFunds: true,
                goal: 300,
                endDate: "2018-01-01",
                lat: 12345,
                lng: 1234,
                image: "test.png"*/
            }
            chai.request(app.server)
                .post('/campaigns/create')
                .send(badcampaign)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });


});
