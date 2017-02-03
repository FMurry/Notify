
var express = require('express');
var app = express();
require('dotenv').config(); 
var mongoose = require('mongoose');
var morgan = require('morgan');
var port = process.env.PORT || 5000;
var passport = require('passport');
var bodyParser = require('body-parser');
var User = require('./app/models/user');



// get our request parameters
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
//Set up passport
app.use(passport.initialize());
require('./config/passport').auth(passport);
require('./config/passport');

//Dev debugging tools
if(process.env.NODE_ENV == 'dev_deep') {
	//Excess Logging
	app.use(morgan('dev'));
	mongoose.set('debug', true);
}
else if(process.env.NODE_ENV == 'dev') {
	app.use(morgan('dev'));
}

function validKey(req, res, next){
	console.log(req.query.apiKey);
	if(req.query.apiKey == process.env.API_KEY){
		next();
	}
	else{
		res.send("Not authorized to use api");
	}
}

app.all('/api/*', validKey, function(req,res,next){
	next();
});



app.get('/', function(req, res) {
  res.send('<h1>Greetings from Notify! The API is at http://localhost:' + port + '/api</h1>');
});


var apiRoutes = require('./config/routes');

//Use the api routes defined in routes.js
app.use('/api', apiRoutes);
// Start the server
app.listen(port);
console.log('Notify Listening at http://localhost:' + port);

