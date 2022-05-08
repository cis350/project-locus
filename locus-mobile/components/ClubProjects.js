import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableHighlight,
} from 'react-native';
import { getUserClubs } from '../modules/api';

function containsUser(userEmail, adminArray) {
  for (let i = 0; i < adminArray.length; i += 1) {
    if (adminArray[i] === userEmail) return true;
  }
  return false;
}

export default function ClubProjects({ club, user, changeClub }) {
  // render all chat if no chat was selected
  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableHighlight style={styles.button} onPress={() => changeClub(undefined)} underlayColor="#b00017">
          <Text style={{ textAlign: 'center', fontSize: 30 }}>Back</Text>
        </TouchableHighlight>
        <Text>
          {club.clubName}
        </Text>
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
  allChatContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#B5E48C',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 30,
  },
  allChats: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    backgroundColor: '#6A9B72',
    width: 300,
    height: 50,
    marginVertical: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
