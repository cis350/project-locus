import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TouchableHighlight, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from 'react-native-progress/Bar';
import { createClub } from '../modules/api';

const club1 = {
  name: 'Club 1',
  master: 'James',
  progress: 0.3,
};

const club2 = {
  name: 'Club 2',
  master: 'Jeffrey',
  progress: 0.2,
};

export default function Clubs({ navigation }) {
  // **change this to fetch all clubs that the user is a part of from DB
  const userClubs = [club1, club2, club2, club2];
  const [modalVisible, setModalVisible] = useState(false);
  const [clubName, setClubName] = useState('');
  // set up the view for all the clubs that the user is in
  const displayClubs = [];
  for (let i = 0; i < userClubs.length; i += 1) {
    displayClubs.push(
      <TouchableOpacity style={styles.club} key={`userClub${i}`} onPress={() => showClub(userClubs[i])}>
        <Text style={styles.clubText}>{userClubs[i].name}</Text>
        <Text style={styles.clubText}>Master: {userClubs[i].master}</Text>
        <ProgressBar progress={userClubs[i].progress} width={200} height={30} color="#8FC7FC" borderRadius={40} />
        <Ionicons
          style={{ color: 'white', textAlign: 'center', paddingVertical: 20 }}
          name="settings"
          size={24}
        />
      </TouchableOpacity>,
    );
  }

  function showClub(club) {
    navigation.navigate('Club', { club });
  }

  async function handleCreateClub() {
    await createClub(clubName);
    setClubName('');
    setModalVisible(false);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* modal for creating clubs */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
        >
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Club Name"
              onChangeText={setClubName}
              value={clubName}
            />
            <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => handleCreateClub()}>
              <Text style={{ fontSize: 20 }}>Create</Text>
            </TouchableHighlight>
          </View>
        </Modal>
        <Text style={{ fontSize: 24 }}>Which Club Needs Work?</Text>
        <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => setModalVisible(true)}>
          <Text style={{ fontSize: 20 }}>Create Club</Text>
        </TouchableHighlight>
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
    paddingHorizontal: 5,
  },
});
