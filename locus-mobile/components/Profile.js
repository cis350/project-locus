/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Image } from 'react-native';

export default function Profile() {
  // fetch user with the given id and display user with following info
  const user = {
    id: 1, name: 'Dustin Fang', year: 2024, major: 'Computer Science', email: 'fdustin@seas.upenn.edu',
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 40}}>My Profile</Text>
      <View style={styles.profileContainer}>
        <Image source={require('../assets/default-profile.jpg')} style={styles.img} />
        <Text>{user.name}</Text>
        <Text>Year: {user.year}</Text>
        <Text>Major: {user.major}</Text>
        <Text>Email: {user.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileContainer: {
    backgroundColor: '#bfe48c',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 25,
    borderRadius: 10,
    marginVertical: 10
  },
  img: {
    width: 300,
    height: 300,
  }
})