/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  Button
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';

export default class notify extends Component {
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
            style = {styles.field}
            label={'Email Address'}
            keyboardType="email-address"
            multiline={false}
            inputStyle={{ color: 'purple' }}
            iconClass={FontAwesomeIcon}
            iconName={'envelope'}
            iconColor={'purple'} />
          <Sae
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
            onPress={null}
            title="Login"
            color="purple"
            accessibilityLabel="Login Here" />
        </View>
      </Image>
    );
  }
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
    color: 'purple'
  },
  field: {
    margin: 40
  },
  button: {
    marginTop: 24
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

AppRegistry.registerComponent('notify', () => notify);
