var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config= require('../../config/database');
var Note = require('./Note');

var validateEmail = function(email) {
	var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	console.log(regex.test(email));
	return regex.test(email);
};

var validatePassword = function(password) {
	return (password.length >=8 && password.length <= 255);
};

var userSchema = new Schema({
	name:{
		type: String,
		required: [true, 'name required'],
	},
	email:{
		type: String,
		unique: true,
		required: true,
		trim: true,
		validate: [validateEmail, 'Please Enter a Valid Email'],
	},
	password:{
		type: String,
		required: true,
		validate: [validatePassword, 'Please Enter A Password between 8 and 24 characters']
	},
	notes:[Note.schema],
	emailVerificationToken: {
    	token: {
    		type: String
    	},
    	expires: {
    		type: Date
    	}
    },
    verified: {
    	type: Boolean,
    	required: true,
    	default: false
    },

	created_at: {
		type: Date,
		default: Date.now()
	},
	updated_at: {
		type: Date,
		default: Date.now()
	}
});

userSchema.pre('save', function(next){
	var now = new Date();

	var user = this;
	if((this.isModified('password') || this.isNew) && this.password) {
		bcrypt.genSalt(10, function(err, salt){
			if(err){
				return next(err);
			}
			bcrypt.hash(user.password, salt, function(err, hash){
				if(err){
					return next(err);
				}
				else{
					user.password = hash;
					next();
				}
			});
		});
	}
	else {
		return next();
	}
});

userSchema.methods.verifyPassword = function(pass, cb) {
	bcrypt.compare(pass, this.password, function(err, isMatch){
		if(err){
			return cb(err);
		}
		cb(null, isMatch);
	});
};


module.exports = mongoose.model('User', userSchema);
