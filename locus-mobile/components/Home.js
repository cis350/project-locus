import React from 'react';
import {
  View, Text, StyleSheet, TouchableHighlight,
} from 'react-native';
import Profile from './Profile';
// import { getUserFullName } from '../modules/storage';

export default function Home({ navigation }) {
  function handleLogout() {
    navigation.navigate('Main');
  }

  return (
    <View style={styles.container}>
      <Profile />
      <TouchableHighlight style={styles.button} onPress={() => handleLogout()} underlayColor="#b00017">
        <Text style={{ textAlign: 'center', fontSize: 30 }}>Logout</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff0022',
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
