
var express = require('express');
var app = express();
require('dotenv').config(); 
var mongoose = require('mongoose');
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

app.get('/', function(req, res) {
  res.send('Greetings from Notify! The API is at http://localhost:' + port + '/api');
});


var apiRoutes = require('./config/routes');

//Use the api routes defined in routes.js
app.use('/api', apiRoutes);
// Start the server
app.listen(port);
console.log('Notify Listening at http://localhost:' + port);

