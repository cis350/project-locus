/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';

export default function Profile({ user }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>My Profile</Text>
      <View style={styles.profileContainer}>
        <Image source={require('../assets/default-profile.jpg')} style={styles.img} />
        <Text>{`${user.firstName} ${user.lastName}`}</Text>
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
    marginVertical: 10,
  },
  img: {
    width: 300,
    height: 300,
  },
});
