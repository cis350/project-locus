import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getUserClubs } from '../modules/api';
import ClubProjects from './ClubProjects';

export default function Projects({ route }) {
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
      <TouchableOpacity style={styles.allChats} key={`club${i}`} onPress={() => changeClub(userClubs[i])}>
        <Text style={{ fontSize: 28, color: 'white' }}>{userClubs[i].clubName}</Text>
      </TouchableOpacity>,
    );
  }

  if (currentClub) return <ClubProjects club={currentClub} user={user} changeClub={changeClub} />;
  // render all chat if no chat was selected
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>Projects</Text>
        <View style={styles.allChatContainer}>
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
});
