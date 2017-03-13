/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 *<Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
 */

var STORAGE_KEY = 'jwt_token';
var API_KEY = ''
var login_params = {
  email: '',
  password: ''
};

import React, { Component } from 'react';
import {
  AppRegistry,
  Alert,
  AsyncStorage,
  StyleSheet,
  Text,
  Image,
  View,
  Button
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';

var NotifyLogin = React.createClass({


  render() {
    return (
      <Image 
      source={require('./assets/sayagata_background.png')}
      style={styles.container}>
        <Text style={styles.title}>
          Notify
        </Text>

        <View style={styles.textContainer}>
          <Sae
            ref= "username"
            style = {styles.field}
            label={'Email Address'}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize='none'
            multiline={false}
            inputStyle={{ color: 'purple' }}
            iconClass={FontAwesomeIcon}
            iconName={'envelope'}
            iconColor={'purple'} />
          <Sae
            ref= "pass"
            style = {styles.field}
            label={'Password'}
            multiline={false}
            secureTextEntry={true}
            inputStyle={{ color: 'purple' }}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={'purple'} />

          <Button
            style = {styles.button}
            onPress={login}
            title="Login"
            color="purple"
            accessibilityLabel="Login Here" />

          <Button
            style = {styles.button}
            onPress={register}
            title="Signup"
            color="purple"
            accessibilityLabel="Signup Here" />
        </View>
      </Image>
    );
  }
});

const login = function() {
  var form = []
  for(var property in login_params){
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(login_params[property]);
    form.push(encodedKey + "=" + encodedValue);
  }
  form = form.join("&");

  return fetch('http://localhost:3000/api/login?apiKey=l20M5sWxdb9nZqKob3D3ao',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        Alert.alert('Login Successful');
      }
      else{
        Alert.alert('Authentication Failed');
      }
    })
    .catch((error) => {
      Alert.alert('Authentication Failed');
    });
}

const register = function() {
  Alert.alert("Not Implemented");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 40,
    color: 'purple',
    backgroundColor: 'transparent'
  },
  field: {
    margin: 40
  },
  button: {
    marginTop: 24,
    marginBottom: 24
  },
  textContainer: {
    padding: 16,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('notify', () => NotifyLogin);
