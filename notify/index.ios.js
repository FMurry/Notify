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
  View
} from 'react-native';

export default class notify extends Component {
  render() {
    return (
      <Image 
        source={require('./assets/sayagata_background.png')}
        style={styles.container}>
        <Text style={styles.title}>
          Notify
        </Text>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 40,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('notify', () => notify);
