//Reuseable functions here
var nodemailer = require('nodemailer');


var generateEmailToken = function() {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var emailToken = '';
	for (var i = 16; i > 0; --i) {
		emailToken += chars[Math.round(Math.random() * (chars.length - 1))];
	}
	// Create expiration date
	var expires = new Date();
	expires.setHours(expires.getHours() + 6);

	var token = {
		token: emailToken,
		expires: expires
	};
	return token;

}

var getToken = function(headers) {
	if(headers && headers.authorization){
		var split = headers.authorization.split(' ');
		if(split.length === 2){
			return split[1];
		}
		else{
			return null;
		}
	}
	else if(headers && headers.access_token){
		return headers.access_token;
	}
	else{
		return null;
	}
}

var sendVerificationEmail = function(newUser, emailVerify, req) {
	if(process.env.NODEMAILER){
				if(process.env.NODEMAILER==='true'){
					//TODO: Move to own method in functions.js
					var transporter = nodemailer.createTransport({
						service: process.env.NODEMAILER_SERVICE,
						auth: {
							user: process.env.NODEMAILER_EMAIL,
							pass: process.env.NODEMAILER_PASS
						}
					});
					var link="https://"+req.get('host')+"/verify?id="+newUser._id+"&tid="+emailVerify.token;
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
					//TODO: End Mailer Move Here
				}
			}
}

module.exports = {
	'generateEmailToken' : generateEmailToken,
	'getToken' : getToken,
	'sendVerificationEmail' : sendVerificationEmail
};
