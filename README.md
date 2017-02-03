#Notify
This is a simple hybrid application that shows a demonstration of a Rest API to interface with application data
Once a user logs in they can add notes to their app and save and delete them. Notes can be accessed from android or ios on a single account
Currently This app only supports email/password authentication with passport.js
This application uses Nodejs, MongoDB and Express for server side and ReactJS on mobile.

##Required Installation
This Application uses MongoDB to store information
[Install MongodDB Here](https://www.mongodb.com/download-center "MongoDB Download Page")

The Server of this application is built on NodeJS
[Install NodeJS Here](https://nodejs.org/en/download/ "NodeJS Download Page")

The Mobile Applications are built using React Native
[Set up React Native Here](https://facebook.github.io/react-native/docs/getting-started.html "Getting Started with React Native")

##Optional Installation
Quickly manage your mongoDB database with [Robomongo](https://robomongo.org/ "Robomongo")

Test out api calls using [Postman](https://www.getpostman.com/ "Postman")


##Setting Up the Server
First off you need to install all of the dependencies, head to ther server folder and run 
```
npm install
```
Once all of the dependencies are installed run you need to create a .env file

Your env file will look something like this:

```
APPNAME=Notify
MONGOLAB_URI_DEV=mongodb://localhost/Notify
NODE_ENV=dev 
MONGOLAB_URI_PROD=
PORT=3000
SECRET=
NODEMAILER=true
NODEMAILER_SERVICE=Gmail
NODEMAILER_EMAIL=
NODEMAILER_PASS=
API_KEY=
```

For the .env file you need to set MONGOLAB_URI_DEV to your own database

for example: mongodb://localhost/<Database Name>

You can choose your own PORT number

For SECRET you need to enter your own unique, random string
For example SECRET=fj2r5hgj40293rvksK

This application sends a verification email when a user signs up
For this you will need to enter your own service, email, and password
[More info about NodeMailer](https://community.nodemailer.com/ "NodeMailer Docs")

Randomly generate your own API_KEY. You will need this as a request query in order for requests to work.
For example localhost:3000/api/login?apiKey=SOME_KEY_HERE

Once set up, to run the server we use 
```
npm start
```

##Setting up Mobile Applications
Ensure that you have react-native installed

Open Xcode and open choose open another project

Navigate to the ios folder and select notify.xcodeproj

From xcode Build the project. Project->Build

Open Android Studio and choose import project

Select the android folder

Build the project

Both Android and iOS should now be setup

In cli type in 
```
react-native run-iOS
```
Simulator for iOS should open

Now Go to your Android Device Manager and start an emulator
Once the emulator is started run
```
react-native run-android
```

The project should now be running on iOS and android

##Testing REST API using Postman
###Registering User
To Register a user select POST from the dropdown menu
use localhost:<port>/api/register?apiKey=<YOUR_API_KEY_HERE> as the address
Select the body field and select x-www-form-urlencoded
Add the fields name, email and password and enter a value for all of them
###Logging in User
Logging is similar to registering a user but your url is localhost:<port>/api/login?apiKey=<YOUR_API_KEY_HERE>
and you only need email and password fields you need the token from the JSON response
###Getting User Profile
To get the the user profile select GET and use localhost:<port>/api/register?apiKey=<YOUR_API_KEY_HERE>, Select headers and enter Authorization as key and the JWT token as the value. The JSON response will have user information
###Adding a Note
To add a Note select POST and use localhost:<port>/api/addNote?apiKey=<YOUR_API_KEY_HERE>, like getting the user profile you will need to set the token in the header. Go to body and use the key note and for the value type in a note (text)
###Removing a Note
To remove a Note select POST and use localhost:<port>/api/removeNote?apiKey=<YOUR_API_KEY_HERE>, you will also need to pass the token in the header and for the body id is key and for the value enter the _id of the note given by the profile request.

visit localhost index page for more info



