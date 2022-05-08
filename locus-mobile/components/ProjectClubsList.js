import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUserClubs } from '../modules/api';
import ClubProjects from './ClubProjects';

export default function ProjectsClubList({ route }) {
  // use state to switch between different projects
  const [currentClub, changeClub] = useState(undefined);
  const [userClubs, setUserClubs] = useState([]);
  const isFocused = useIsFocused();
  const { user } = route.params;

  useEffect(() => {
    async function getClubs() {
      setUserClubs((await getUserClubs(user.email)).jsonContent);
    }
    getClubs();
  }, [isFocused]);

  // setup view for all chats
  const displayClubs = [];
  for (let i = 0; i < userClubs.length; i += 1) {
    displayClubs.push(
      <TouchableOpacity style={styles.club} key={`userClub${i}`} onPress={() => changeClub(userClubs[i])}>
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

  if (currentClub) {
    return <ClubProjects clubName={currentClub.clubName} user={user} changeClub={changeClub} />;
  }
  // render all chat if no chat was selected
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>Select Club to View Projects</Text>
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
    margin: 10,
    paddingHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 5,
  },
});
