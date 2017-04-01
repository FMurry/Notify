var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../app/models/User');
var passport = require('passport');
require('dotenv').config(); 


var Auth = function(passport) {
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = process.env.SECRET;
	passport.use(new JwtStrategy(opts, function(jwt_payload, done){
		User.findOne({id: jwt_payload.id}, function(err,user){
			//Error has occured
			if(err){
				return done(err,false);
			}

			//User was found
			if(user){
				done(null, user);
			}

			//No User was found
			else{
				done(null, false);
			}
		});
	}));
}



module.exports = {
   'auth': Auth
};