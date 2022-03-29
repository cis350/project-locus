import React from 'react';
import {
  View, Text, StyleSheet, TouchableHighlight,
} from 'react-native';
import Profile from './Profile';
// import { getUserFullName } from '../modules/storage';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6A9B72',
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default function Home({ navigation }) {
  function handleLogout() {
    navigation.navigate('Main');
  }

  return (
    <View style={styles.container}>
      <Profile />
      <TouchableHighlight style={styles.button} onPress={() => handleLogout()} underlayColor="#33E86F">
        <Text>Logout</Text>
      </TouchableHighlight>
    </View>
  );
}
