import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';

// passed in justRegistered and setJustRegistered previously
const Main = function MainComponent({ navigation, routes }) {

  function handleLogin() {
    console.log("Login");
  }

  function handleRegister() {
    console.log("Register");
  }

  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center', fontSize: 40}}>Welcome To Locus!</Text>
      <View style={styles.buttonContainer}>
        <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => handleLogin()}>
          <Text style={{ fontSize: 30 }}>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => handleRegister()}>
          <Text style={{ fontSize: 30 }}>Register</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
  },
  button: {
    backgroundColor: '#6A9B72',
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  }
})
