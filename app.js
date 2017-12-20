if (!process.env.NODE_ENV) {
	switch (process.argv[2]) {
		case 'production':
			process.env.NODE_ENV = 'production';
			break;
		case 'development':
			process.env.NODE_ENV = 'development';
			break;
		default:
			process.exit(1);
	}
}
var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');

var Config = require('./config'), config = new Config();
console.log(config);

var db = require('./models/db');
var userModel = require('./models/users');
var repliesModel = require('./models/replies');
var donationModel = require('./models/donations');
var commentModel = require('./models/comments');
var campaignModel = require('./models/campaigns');
var reportModel = require('./models/reports');

var index = require('./routes/index');
var users = require('./routes/users');
var campaigns = require('./routes/campaigns');
var admin = require('./routes/admin');
var account = require('./routes/account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true,
	parameterLimit: 50000
}));
app.use(expressValidator());
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'dream',
	saveUninitialized: false,
	resave: false,
	maxAge: 3600000
}));

// images folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// set isAdmin variable
app.use(function(req, res, next) {
	res.locals.isAdmin = req.session.isAdmin;
	next();
});

app.use('/', index);
app.use('/users', users);
app.use('/campaigns', campaigns);
app.use('/account', account);
app.use('/admin',function(req, res, next) {
	if(req.session.isAdmin){
		next();
	} else {
		res.status(401).redirect('/');
	}
}, admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.redirect('/');
});

/**
 * Module dependencies.
 */

var debug = require('debug')('ldso:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}

module.exports.server = server;
