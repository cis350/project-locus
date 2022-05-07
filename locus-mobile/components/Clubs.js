import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TouchableHighlight, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  createClub, getUserId, getUserClubs, getSpecificClub, joinClub,
} from '../modules/api';

export default function Clubs({ route, navigation }) {
  const [userClubs, setUserClubs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [joinClubModalVisible, setJoinClubModalVisible] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubPassword, setNewClubPassword] = useState('');
  const [joinClubName, setJoinClubName] = useState('');
  const [joinClubPassword, setJoinClubPassword] = useState('');
  const { user } = route.params;

  useEffect(() => {
    async function initialize() {
      setUserClubs((await getUserClubs(user.email)).jsonContent);
    }
    initialize();
  }, []);

  // set up the view for all the clubs that the user is in
  const displayClubs = [];
  for (let i = 0; i < userClubs.length; i += 1) {
    displayClubs.push(
      <TouchableOpacity style={styles.club} key={`userClub${i}`} onPress={() => showClub(userClubs[i].clubName)}>
        <Text style={styles.clubText}>{userClubs[i].clubName}</Text>
        <Text style={styles.clubText}>Role: {userClubs[i].role}</Text>
        <Ionicons
          style={{ color: 'white', textAlign: 'center', paddingVertical: 20 }}
          name="settings"
          size={24}
        />
      </TouchableOpacity>,
    );
  }

  async function showClub(clubName) {
    const club = (await getSpecificClub(clubName)).jsonContent;
    navigation.navigate('Club', { club });
  }

  async function handleCreateClub() {
    const masterId = await getUserId(user.email);
    const response = await createClub(newClubName, masterId, newClubPassword);
    if (response.status !== 200) Alert.alert('Creation Failed');
    setUserClubs((await getUserClubs(user.email)).jsonContent);
    setNewClubName('');
    setNewClubPassword('');
    setModalVisible(false);
  }

  async function handleJoinClub() {
    const response = await joinClub(joinClubName, user.email, joinClubPassword);
    setUserClubs((await getUserClubs(user.email)).jsonContent);
    setJoinClubName('');
    setJoinClubPassword('');
    if (response.status !== 200) Alert.alert('Join Club Failed');
    setJoinClubModalVisible(false);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* modal for creating clubs */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <TextInput
                style={styles.input}
                placeholder="Club Name"
                onChangeText={setNewClubName}
                value={newClubName}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setNewClubPassword}
                value={newClubPassword}
                // eslint-disable-next-line react/jsx-boolean-value
                secureTextEntry={true}
              />
              <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => handleCreateClub()}>
                <Text style={{ fontSize: 20 }}>Create</Text>
              </TouchableHighlight>
            </View>
          </Modal>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={joinClubModalVisible}
          >
            <View style={styles.centeredView}>
              <TextInput
                style={styles.input}
                placeholder="Club Name"
                onChangeText={setJoinClubName}
                value={joinClubName}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setJoinClubPassword}
                value={joinClubPassword}
                // eslint-disable-next-line react/jsx-boolean-value
                secureTextEntry={true}
              />
              <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => handleJoinClub()}>
                <Text style={{ fontSize: 20 }}>Join</Text>
              </TouchableHighlight>
            </View>
          </Modal>
        </View>
        <Text style={{ fontSize: 24 }}>Which Club Needs Work?</Text>
        <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => setModalVisible(true)}>
          <Text style={{ fontSize: 20 }}>Create Club</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => setJoinClubModalVisible(true)}>
          <Text style={{ fontSize: 20 }}>Join Club</Text>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  input: {
    backgroundColor: 'white',
    borderColor: 'gray',
    width: 250,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
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
