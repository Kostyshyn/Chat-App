var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = Schema({
	role: {
		type: Number,
		default: 0
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	online: {
		type: Boolean,
		default: false
	},
	// messages: [{}],
	// grourps: [{}],
	created: {
		type: Date,
		default: Date.now
	}
});

userSchema.pre('save', function(next){
	var user = this;
	if (user.isModified('password')){

		var hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
		user.password = hash;
		return next(user);
		
	}
	return next();
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(user){
	return new Promise(function(resolve, reject){
		User.create(user, function(err, user){
			if (err){
				reject(err);
			} else {
				resolve(user);
			}
		});
	});
};

module.exports.getUser = function(id){
	return new Promise(function(resolve, reject){
		var query = { _id: id };
		User.findOne(query, function(err, user){
			if (err){
				reject(err);
			} else {
				resolve(user);
			}
		});
	});
};

module.exports.editUser = function(id, user, options){ // options { new: true }
	return new Promise(function(resolve, reject){
		var query = { _id: id };
		User.findOneAndUpdate(query, user, options, function(err, user){
			if (err){
				reject(err);
			} else {
				resolve(user);
			}
		});
	});
};


