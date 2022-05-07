/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, Alert
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { Ionicons } from '@expo/vector-icons';
import {
  getUser, removeMember, promoteMember, getSpecificClub,
} from '../modules/api';
import Profile from './Profile';

// mock the users and projects in the club
const project = {
  name: 'Project 1',
  lead: 'Jeffrey',
  progress: 0.3,
};

export default function Club({ route }) {
  const { club, user } = route.params;
  const [profile, setProfile] = useState(undefined);
  const [currentClub, setClub] = useState(club);

  async function showProfile(memberEmail) {
    const member = (await getUser(memberEmail)).result;
    setProfile(member);
  }

  async function handleRemoveMember(memberEmail) {
    const response = await removeMember(currentClub.clubName, user.email, memberEmail);
    Alert.alert(response.jsonContent);
    setClub((await getSpecificClub(currentClub.clubName)).jsonContent);
  }

  async function handlePromoteMember(memberEmail) {
    const response = await promoteMember(currentClub.clubName, user.email, memberEmail);
    Alert.alert(response.jsonContent);
    setClub((await getSpecificClub(currentClub.clubName)).jsonContent);
  }

  // setup view for all the users in the club
  const displayMembers = [];
  for (let i = 0; i < currentClub.members.length; i += 1) {
    displayMembers.push(
      <View style={styles.member} key={`clubMember${i}`}>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => showProfile(currentClub.members[i])}
        >
          <Text style={{ fontSize: 15, marginLeft: 10, color: 'white' }}>{currentClub.members[i]}</Text>
        </TouchableOpacity>
        <TouchableHighlight
          style={styles.promote}
          onPress={() => handlePromoteMember(currentClub.members[i])}
        >
          <Ionicons
            style={{ color: 'white', textAlign: 'center' }}
            name="arrow-up-circle-outline"
            size={20}
          />
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.remove}
          onPress={() => handleRemoveMember(currentClub.members[i])}
        >
          <Ionicons
            style={{ color: 'white', textAlign: 'center' }}
            name="close-circle-outline"
            size={20}
          />
        </TouchableHighlight>
      </View>,
    );
  }

  // setup view for active projects in the club
  const displayProjects = [];
  for (let i = 0; i < 5; i += 1) {
    displayProjects.push(
      <TouchableOpacity style={styles.project} key={`userProject${i}`}>
        <Text style={styles.projectText}>{project.name}</Text>
        <Text style={styles.projectText}>Lead: {project.lead}</Text>
        <ProgressBar progress={project.progress} width={200} height={30} color="#8FC7FC" borderRadius={40} marginBottom={20} />
      </TouchableOpacity>,
    );
  }

  if (profile) {
    return (
      <View style={styles.container}>
        <Profile user={profile} />
        <TouchableHighlight style={styles.button} onPress={() => setProfile(undefined)} underlayColor="#b00017">
          <Text style={{ textAlign: 'center', fontSize: 30 }}>Return</Text>
        </TouchableHighlight>
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>Welcome to {currentClub.clubName}!</Text>
        <Text style={{ fontSize: 20, marginTop: 20 }}>Members</Text>
        <ScrollView style={styles.memberContainer}>
          {displayMembers}
        </ScrollView>
        <Text style={{ fontSize: 20 }}>Projects</Text>
        <View style={styles.projectContainer}>
          {displayProjects}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6A9B72',
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 25,
  },
  projectContainer: {
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
  project: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6A9B72',
    width: 300,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 10,
  },
  projectText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    marginVertical: 5,
  },
  member: {
    flexDirection: 'row',
    backgroundColor: '#6A9B72',
    justifyContent: 'flex-end',
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 15,
  },
  promote: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    width: 50,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  remove: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    width: 50,
    borderRadius: 5,
    marginHorizontal: 10,
  },
});
