#Notify
This is a simple hybrid application that uses a Rest API to interface with application data
Once a user logs in they can add notes to their app and save them. Notes can be accessed from android, ios or web on a single account
Currently This app only supports email/password authentication

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

```javascript
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
```

For the .env file you need to set MONGOLAB_URI_DEV to your own database

for example: mongodb://localhost/<Database Name>

You can choose your own PORT number

For SECRET you need to enter your own unique, random string
For example SECRET=fj2r5hgj40293rvksK

This application sends a verification email when a user signs up
For this you will need to enter your own service, email, and password
[More info about NodeMailer](https://community.nodemailer.com/ "NodeMailer Docs")




