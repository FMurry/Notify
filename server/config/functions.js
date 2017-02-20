//Reuseable functions here

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

var sendVerificationEmail = function(user, emailToken)

module.exports = {
	generateEmailToken,
	getToken
};