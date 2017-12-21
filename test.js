process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');

require('./test/backend/users');
require('./test/backend/campaigns');
//return;