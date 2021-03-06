var express = require('express');
var User = require('../app/models/User');
var Note = require('../app/models/Note')
var jwt = require('jwt-simple');
var passport = require('passport');
require('dotenv').config();
var useful = require('./functions'); 

var apiRoutes = express.Router();
var Routes = express.Router();


apiRoutes.post('/login', function(req,res){
	User.findOne({
		email: req.body.email
	}, function(err, user){
		if(err){
			throw err;
		}

		if(!user){
			res.send({
				success: false,
				code: 504,
				msg: 'Authentication failed.'
			})
		}
		else{
			user.verifyPassword(req.body.password, function(err, isMatch){
				if(isMatch && !err){
					//Login is successful
					//Generate the token
					var token = jwt.encode(user,process.env.SECRET);
					res.json({
						success: true,
						code: 200,
						user: {
							_id: user._id,
							name: user.name,
							email: user.email
						},
						msg: 'Login Successful',
						token: 'JWT '+ token
					});
				}
				else{
					res.send({
						success: false, 
						code:502, 
						msg: 'Authentication failed.'
					});
				}
			})
		}
	});
});

apiRoutes.post('/register', function(req, res){
	//If one of the fields are empty
	if(!req.body.name || !req.body.email || !req.body.password){
		res.json({
			success: false, 
			msg: 'Missing a required field'});
	}
	//Create the new user
	else{

		var newUser = new User({
			email: req.body.email,
			name: req.body.name,
			password: req.body.password
		});
		// var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		// var emailToken = '';
		// for (var i = 16; i > 0; --i) {
		// 	emailToken += chars[Math.round(Math.random() * (chars.length - 1))];
		// }
		// // create expiration date
		// var expires = new Date();
		// expires.setHours(expires.getHours() + 6);
		var emailVerify = useful.generateEmailToken();
		newUser.emailVerificationToken = {
			token: emailVerify.token,
			expires: emailVerify.expires
		};

		//Saves the user to db save hashes the password because of pre function
		newUser.save(function(err) {
			if(err){
				console.log(err);
				//Mongodb unique error, user already exists
				if(err.code == 11000){
					return res.json({ success: false, code: 401,msg: "User already exists"})
				}

				//Hit the validation error
				else if(err.name='ValidatorError') {
					//Validation issue with email
					// if(err.errors.email){
					// 	return res.json({ success: false, code: 402,msg: err.errors.email.message})
					// }
					// //Validation issue with name
					// else if(err.errors.name){
					// 	return res.json({ success: false, code: 403,msg: err.errors.name.message})
					// }
					// //Validation Issue with password
					// else if(err.errors.password){
					// 	return res.json({ success: false, code: 404,msg: err.errors.password.message})
					// }
					//Unknown error
					return res.json({ success: false, code: 450, msg: "Validation Error"})
				}
				else{
					console.log(err);
					return res.json({ success: false, code: 401,msg: "Internal Server Error"})
				}
			}
			//Handles Email Sending when user signs up
			useful.sendVerificationEmail(newUser,emailVerify,req);
			res.json({success: true, code:200, msg: 'New user created successfully'});
		});	
	}
});

//Verify the user email
Routes.get('/verify', function(req, res){
	console.log("Verify Reached");
	User.findOne({
		_id: req.query.id
	}, function(err, user){
		if(err){
			throw err;
			res.send('<h1>Error has occured please request another verification email through the app');
		}
		else if(!user){
			res.send("<h1>Error has occured please request another verification email through the app</h1>")
			res.end();
			return;
		}
		else{
			//Verify Here
			var userEmailToken = user.emailVerificationToken.token;
			if(user.verified == true){
				//User is verified so all links are invalid
				res.end('<h1>Link no longer valid</h1>');
			}
			else if(userEmailToken === req.query.tid) {
				console.log("There is a match");
				var currentDate = new Date();
				if(currentDate < user.emailVerificationToken.expires){
					user.verified = true;
					user.save(function(err){
						if(err){
							//console.log(err);
							console.log("User saving error");
						}
						else{
							res.send("<h1>Email verified successfully");
						}

					});
				}

				
			}
		}
	})
});

/*
*	Route to reverify 
*/
apiRoutes.post('/reverify', passport.authenticate('jwt', {session: false}), function(req, res){
	//TODO: Implement
	var token = useful.getToken(req.headers);
	if(token) {
		var decodedToken = jwt.decode(token, process.env.SECRET);
		User.findOne({
			email: decode.email
		}, function(err, user){
			if(err){
				throw err;
				res.end("Internal Server Error");
			}
			if(!user){
				return res.status(403).send({success: false, code: 501, msg: 'Authentication failed. User not found'});
			}
			else{
				//Resend the verification email
			}
		})
	}
});

apiRoutes.get('/profile', passport.authenticate('jwt', {session: false}), function(req, res){
	//Get the Javascript web token
	var token = useful.getToken(req.headers);
	if(token) {
		var decode = jwt.decode(token, process.env.SECRET);
		User.findOne({
			email: decode.email
		}, function(err, user){
			if(err) {
				throw err;
				res.end("Internal Server Error");
			}
			if(!user){
				return res.status(403).send({success: false, code:501, token: '',msg: 'Authentication failed. User not found.'});
			}
			else{
				res.json({success: true, 
					code: 200, 
					msg: 'Got Profile',
					user: {
						name:user.name,
						email: user.email,
						notes: user.notes
					}
				});
			}
		});
	}
});

//Add a Term
apiRoutes.post('/addNote', passport.authenticate('jwt', {session: false}), function(req, res){
	var token = useful.getToken(req.headers);
	if(token){
		var decodedToken = jwt.decode(token, process.env.SECRET);
		User.findOne({
			email: decodedToken.email
		}, function(err, user){
			if(err){
				throw err;
			}

			if(!user){
				return res.status(403).send({success: false, code:501, msg: 'Authentication failed. User not found.'});
			}
			else{
				var newNote = new Note({
					description: req.body.note
				});
				user.notes.push(newNote);
				//Save the note here
				user.save(function(err){
					if(err){
						console.log(err);
						return res.status(403).send({success: false, code: 502, msg: "Internal Server Error"});
					}
					res.json({success: true, code: 200, msg: "Note Saved Successfully"});
				});
				
			}
		});
	}
	else{
		return res.status(403).send({success: false, msg: 'No token provided.'});
	}
});

apiRoutes.delete('/removeNote', passport.authenticate('jwt', {session: false}), function(req,res){
	var token = useful.getToken(req.headers);
	if(token) {
		var decodedToken = jwt.decode(token, process.env.SECRET);
		User.findOne({
			email: decodedToken.email
		}, function(err, user){
			if(err){
				console.log(err);
			}
			if(!user){
				return res.status(403).send({success: false, code:501, msg: 'Authentication failed. User not found'});
			}
			else{
				if(user.notes && req.body.id) {
					var found = false;
					//User has at least one note and request has id parameter
					for(var i = 0; i< user.notes.length; i++){
						console.log(user.notes[i]._id);
						if(user.notes[i]._id == req.body.id){
							//TODO: Delete the Note and RETURN
							found = true;
							console.log("There is a match");
							user.notes.splice(i,1);
							console.log(user.notes);
							user.save(function(err){
								if(err){
									console.err(err);
								}
								return res.json({success: true, code: 200, msg: 'Note with id '+req.body.id+' successfully deleted'});
								console.log("Delete Successful");
							});
						}
					}
					if(!found){
						//Note to delete was note found
						return res.json({success: false, code: 601, msg: 'Note was not found with _id: '+req.body.id})
					}

				}
				else{
					//Either user has no notes to delete or improper request sent
					if(!user.notes){
						return res.json({success: false, code: 602, msg: 'User has no Notes to delete'});
					}
					if(!req.body.id){
						return res.json({success: false, code: 603, msg: 'Designate which note to delete'});
					}

				}
			}
		});
	}
});

module.exports = {
	apiRoutes,
	Routes
}