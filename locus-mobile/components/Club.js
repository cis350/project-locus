import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableHighlight, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from 'react-native-progress/Bar';

export default function Club({club, setClub}) {
  const users = ['Bob', 'Tim'];
  const displayUsers = [];
  for (let i = 0; i < 50; i += 1) {
    displayUsers.push(
      <View style={styles.member}>
        <Image source={require('../assets/default-profile.jpg')} style={{width: 50, height: 50}} />
        <Text style={{fontSize: 28, marginLeft: 100}}>{users[0]}</Text>
      </View>
    )
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => setClub(null)}>
          <Text style={{ fontSize: 30 }}>Back</Text>
        </TouchableHighlight>
        <Text style={{ fontSize: 24 }}>{club.name}</Text>
        <ScrollView style={styles.memberContainer}>
          {displayUsers}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 25,
  },
  clubContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#B5E48C',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 30,
  },
  memberContainer: {
    flexDirection: 'column',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 30,
    backgroundColor: '#B5E48C',
    height: 200,
    width: 350,
  },
  club: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6A9B72',
    width: 300,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  clubText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    marginVertical: 5,
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
  member: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingVertical: 10,
  }
});
