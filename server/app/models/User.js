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
		validate: {
			validator: function(v) {
				return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
			},
			message: '{VALUE} is not a valid email!'
		}
	},
	password:{
		type: String,
		required: true,
		validate: {
			validator: function(v) {
				return (v.length >=8 && v.length <= 255);
			},
			message: 'Not a valid password'
		}
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
	},
	google_id: {
		type: String
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
