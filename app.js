const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');

const config = require('./config');

const router = require('./routes');
const api = require('./routes/api/v1.0')

const app = express();
const server = require('http').createServer(app);

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


mongoose.connect(config.dbUrl);

var db = mongoose.connection;

db.on('error', function(err){
	console.log('Error:', err.stack);
});

db.once('connected', function(){
	console.log('Database connected!');
});

app.use('/', router);

app.use('/api', api);

app.use(function(req, res, next){
	res.status(404);
	res.send('Not found: ' + req.url);
});

app.use(function(err, req, res, next){
	var status = err.status || 500;
	res.status(status);
	res.send('Internal server error: ' + err);
});

// var User = require('./models/user');

// User.createUser({
// 	username: 'kos',
// 	password: 'pass'
// }).then(function(user){
// 	console.log('create user', user);

// 	User.getUser(user.id).then(function(user){

// 		console.log('get user', user.username);

// 		User.editUser(user.id, {
// 			username: 'Andriy'
// 		}, {
// 			new: true
// 		}).then(function(user){
// 			console.log('edit user', user.username);
// 		}).catch(function(err){
// 			console.log(err);
// 		});

// 	}).catch(function(err){
// 		console.log(err);
// 	});

// }).catch(function(err){
// 	console.log(err);
// });

app.use(function (err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('Something broke!')
})

server.listen(config.port, function(){
	console.log('Server started on port:', config.port);
});