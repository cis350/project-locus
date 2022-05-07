/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TouchableHighlight,
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { getUser } from '../modules/api';
import Profile from './Profile';

// mock the users and projects in the club
const project = {
  name: 'Project 1',
  lead: 'Jeffrey',
  progress: 0.3,
};

export default function Club({ route }) {
  const [profile, setProfile] = useState(undefined);
  const { club } = route.params;

  // setup view for all the users in the club
  const displayMembers = [];
  for (let i = 0; i < club.members.length; i += 1) {
    displayMembers.push(
      <TouchableOpacity style={styles.member} key={`clubMember${i}`} onPress={() => showProfile(club.members[i])}>
        <Text style={{ fontSize: 15, marginLeft: 10, color: 'white' }}>{club.members[i]}</Text>
      </TouchableOpacity>,
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

  async function showProfile(memberEmail) {
    const member = (await getUser(memberEmail)).result;
    setProfile(member);
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
        <Text style={{ fontSize: 24 }}>{club.name}</Text>
        <ScrollView style={styles.memberContainer}>
          {displayMembers}
        </ScrollView>
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
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 15,
  },
});
