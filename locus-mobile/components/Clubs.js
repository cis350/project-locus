import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
} from 'react-native';

const club1 = {
  name: 'Club 1',
  master: 'James',
  progress: 30,
};

const club2 = {
  name: 'Club 2',
  master: 'Jeffrey',
  progress: 20,
};

export default function Clubs() {
  const userClubs = [club1, club2, club2, club2];

  const displayClubs = [];
  for (let i = 0; i < userClubs.length; i += 1) {
    displayClubs.push(
      <View style={styles.club}>
        <Text style={{ textAlign: 'center', fontSize: 24, color: 'white' }}>{userClubs[i].name}</Text>
        <Text style={{ textAlign: 'center', fontSize: 24, color: 'white' }}>{userClubs[i].master}</Text>
        <Text style={{ textAlign: 'center', fontSize: 24, color: 'white' }}>{userClubs[i].progress}/100</Text>
      </View>,
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Which Club Needs Work?</Text>
        <View style={styles.clubContainer}>
          {displayClubs}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 50,
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
  club: {
    flexDirection: 'column',
    backgroundColor: '#6A9B72',
    width: 300,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
});
