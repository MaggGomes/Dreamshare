process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var app = require('../test');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');
var should = chai.should();


require('./users');
require('./campaigns');