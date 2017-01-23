var express = require('express');
var User = require('../app/models/User');
var nodemailer = require('nodemailer');
var jwt = require('jwt-simple');

var apiRoutes = express.Router();

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
		res.json({success: false, msg: 'Missing a required field'});
	}
	//Create the new user
	else{

		var newUser = new User({
			email: req.body.email,
			name: req.body.name,
			password: req.body.password
		});
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var emailToken = '';
		for (var i = 16; i > 0; --i) {
			emailToken += chars[Math.round(Math.random() * (chars.length - 1))];
		}
		// create expiration date
		var expires = new Date();
		expires.setHours(expires.getHours() + 6);

		newUser.emailVerificationToken = {
			token: emailToken,
			expires: expires
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
					return res.json({ success: false, code: 450, msg: err})
				}
				else{
					console.log(err);
					return res.json({ success: false, code: 401,msg: "Internal Server Error"})
				}
			}
			//Handles Email Sending when user signs up
			if(process.env.NODEMAILER){
				if(process.env.NODEMAILER==='true'){
					var transporter = nodemailer.createTransport({
						service: process.env.NODEMAILER_SERVICE,
						auth: {
							user: process.env.NODEMAILER_EMAIL,
							pass: process.env.NODEMAILER_PASS
						}
					});
					var link="http://"+req.get('host')+"/api/verify?id="+newUser._id+"&tid="+emailToken;
					mailOptions = {
						from: process.env.NODEMAILER_EMAIL, // sender address
						to: newUser.email, // list of receivers
						subject : "Welcome to Notify",
						html : "Hello and welcome to Notify,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
					};

					transporter.sendMail(mailOptions, function(error, info) {
						if(error){
							console.log(error);
						}
						else{
							console.log('Message sent: ' + info.response);
						}
					});
				}
			}
			res.json({success: true, code:200, msg: 'New user created successfully'});
		});	
	}
});

//Verify the user email
apiRoutes.get('/verify', function(req, res){
	console.log("Verify Reached");
	User.findOne({
		_id: req.query.id
	}, function(err, user){
		if(err){
			throw err;
			res.send('<h1>Error has occured please request another verification email');
		}
		else if(!user){
			console.log("User not found");
			res.send("<h1>Invalid email</h1>")
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


module.exports = apiRoutes;