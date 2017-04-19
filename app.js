const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');

const config = require('./config');

const router = require('./routes');

const app = express();
const server = require('http').createServer(app);

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: 'secret-key',
	saveUninitialized: true,
	resave: true
}))

mongoose.connect(config.dbUrl);

var db = mongoose.connection;

db.on('error', function(err){
	console.log('Error:', err.stack);
});

db.once('connected', function(){
	console.log('Database connected!');
});

app.use('/', router);

app.use(function(req, res, next){
	res.status(404);
	res.send('Not found: ' + req.url);
});

app.use(function(err, req, res, next){
	var status = err.status || 500;
	res.status(status);
	res.send('Internal server error: ' + err);
});

server.listen(config.port, function(){
	console.log('Server started on port:', config.port);
});