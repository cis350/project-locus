/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { getUser } from '../modules/api';

// mock the users and projects in the club
const project = {
  name: 'Project 1',
  lead: 'Jeffrey',
  progress: 0.3,
};

export default function Club({ route, navigation }) {
  const { club } = route.params;

  console.log(club);
  // setup view for all the users in the club
  const displayMembers = [];
  for (let i = 0; i < club.members.length; i += 1) {
    displayMembers.push(
      <TouchableOpacity style={styles.member} key={`clubMember${i}`} onPress={() => showProfile(club.members[i])}>
        <Image source={require('../assets/default-profile.jpg')} style={{ width: 50, height: 50 }} />
        <Text style={{ fontSize: 20, marginLeft: 30, color: 'white' }}>{club.members[i]}</Text>
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
    console.log(member);
    navigation.navigate('Profile', { member });
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
    marginVertical: 5,
    paddingVertical: 10,
  },
});
