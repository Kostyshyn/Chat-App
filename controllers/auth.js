var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var util = require('../util');
var User = require('../models/user');
var config = require('../config');

module.exports.signup = function(req, res, next){
	var user = req.body.user;
	if (!user.username || !user.password){
		res.status(403);
		res.json({
			message: 'Missing credentials',
			success: false,
			status: 403
		});
	} else {
		User.findOne({
			'username': user.username
		}, function(err, user){
			if (err){
				return next(err);
			} else if (user){
				res.status(403);
				res.json({
					message: 'User is already exists',
					success: false,
					status: 403
				});
			} else {
				var newUser = {
					username: req.body.user.username,
					password: req.body.user.password,
					created: Date.now()
				};
				User.createUser(newUser).then(function(user){

					var token = jwt.sign({ id: user._id }, config.secret, {
				      expiresIn: 86400 // expires in 24 hours
				    });

					util.sendRes(res, {
						user: user,
						token: token	
					});

				}).catch(function(err){
					next(err);
				});
			}
		});
	}
};

module.exports.login = function(req, res, next){
	var userInput = {
		username: req.body.user.username,
		password: req.body.user.password
	};
	console.log(userInput);
	User.findOne({
		'username': userInput.username
	}, function(err, user){
		if (err){
			next(err);
		} else {
			if (!user){
				res.status(403);
				res.json({
					message: 'User not found',
					success: false,
					status: 403
				});
			} else if (!isValidPassword(user, userInput.password)){
				res.status(401);
				res.json({
					message: 'Invalid password',
					success: false,
					status: 401
				});
			} else {
				var token = jwt.sign({ id: user._id }, config.secret, {
				    expiresIn: 86400 
				});

				util.sendRes(res, {
					user: user,
					token: token	
				});
			}
		}
	});
};

module.exports.logout = function(){};

function isValidPassword(user, password){
	return bcrypt.compareSync(password, user.password);
};

