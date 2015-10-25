var express = require('express');
var config = require('./config');
var morgan = require('morgan'),
    compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash'),
	http = require('http'),
	socketio = require('socket.io');
var MongoStore = require('connect-mongo')(session);
module.exports = function () {
	var app = express();
	var server = http.createServer(app);
	var io = socketio.listen(server);
	
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	
	var mongoStore = new MongoStore({
		db: db.connection.db
	});
	
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: mongoStore
	}));
	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/articles.server.routes.js')(app);
	
	require('./socketio')(server, io, mongoStore);
	
	app.use(express.static('./public'));
	
	return server;
};