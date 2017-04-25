
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
require('dotenv').config(); 
const mongoose = require('mongoose');
const morgan = require('morgan');
const port = process.env.PORT || 5000;
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('./app/models/User');
const path = require('path');



// get our request parameters
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
//Set up passport
app.use(passport.initialize());

//Set the view engine
app.set('view engine', 'pug')

//Passport initialization
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
  res.render('index', {
  	title: 'Notify REST API',
  	greetings: 'Greetings from Notify! your server is located at localhost:'+port+'/api',
  	port: port
	});
});


var notifyRoutes = require('./config/routes');

//Use the api routes defined in routes.js
app.use('/api', notifyRoutes.apiRoutes);
app.use('/', notifyRoutes.Routes);
// Start the server
https.createServer({
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
	passphrase: process.env.CERT_KEY 
},app).listen(port);
//app.listen(port);
console.log('Notify Listening at https://localhost:' + port);

