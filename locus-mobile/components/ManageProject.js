/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableHighlight, Alert, TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { removeUserFromProject, getSpecificProject, assignUserToProject, deleteProject } from '../modules/api';
import ManageTasks from './ManageTasks';

export default function ManageProject({ project, changeProject, user, club }) {
  const [memberEmail, setMemberEmail] = useState('');
  const [jawn, rerender] = useState(false);
  const [currProject, setCurrProject] = useState(project);
  const [managingTask, setManagingTask] = useState(false);

  useEffect(() => {
    async function setProject() {
      setCurrProject((await getSpecificProject(club.clubName, project.projectName))
        .jsonContent.result);
    }
    setProject();
  }, [jawn]);

  // removeUserFromProject(clubName, projectName, requestedEmail, assigneeEmail, leaderEmail) {
  async function handleRemoveMember(emailToRemove) {
    const response = (
      await removeUserFromProject(club.clubName, project.projectName, user.email, emailToRemove, project.leaderEmail));
    if (response.status !== 200) Alert.alert('Invalid Request');
    rerender(!jawn);
  }

  async function addMember() {
    const response = (
      await assignUserToProject(club.clubName, project.projectName, user.email, memberEmail));
    if (response.status !== 201) Alert.alert('Invalid Request');
    if (response.status === 201) Alert.alert('Member Added');
    rerender(!jawn);
    setMemberEmail('');
  }

  async function handleDeleteProject() {
    await deleteProject(club.clubName, project.projectName, user.email);
    Alert.alert('Project Deleted');
    changeProject(undefined);
  }

  const displayMembers = [];
  for (let i = 0; i < currProject.members.length; i += 1) {
    displayMembers.push(
      <View style={styles.member} key={`member${i}`}>
        <Text style={{ fontSize: 15 }}>{currProject.members[i]}</Text>
        <TouchableHighlight style={styles.removeButton} onPress={() => handleRemoveMember(currProject.members[i])} underlayColor="#b00017">
          <Text style={{ textAlign: 'center', fontSize: 15, color: 'white' }}>Remove</Text>
        </TouchableHighlight>
      </View>,
    );
  }

  if (user.email !== project.leaderEmail) {
    return (
      <ManageTasks
        project={project}
        setManagingTask={changeProject}
        user={user}
        club={club}
      />
    );
  }
  if (managingTask) {
    return (
      <ManageTasks
        project={currProject}
        setManagingTask={setManagingTask}
        user={user}
        club={club}
      />
    );
  }
  return (
    <KeyboardAwareScrollView scrollToEnd={{ animated: true }}>
      <View style={styles.container}>
        <Text style={styles.projectTitle}>{currProject.projectName}</Text>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.memberContainer}>
            {displayMembers}
          </View>
        </ScrollView>
        <View style={styles.addMemberContainer}>
          <TextInput
            style={styles.input}
            placeholder="Member Name"
            placeholderTextColor="grey"
            onChangeText={setMemberEmail}
            value={memberEmail}
          />
          <TouchableHighlight style={styles.addMember} underlayColor="#33E86F" onPress={() => addMember()}>
            <Ionicons
              style={{ color: 'white', textAlign: 'center' }}
              name="add-outline"
              size={24}
            />
          </TouchableHighlight>
        </View>
        <TouchableHighlight style={styles.button} onPress={() => setManagingTask(true)} underlayColor="#33E86F">
          <Text style={{ textAlign: 'center', fontSize: 20 }}>Manage Tasks</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.backButton} onPress={() => changeProject(undefined)} underlayColor="#33E86F">
          <Text style={{ textAlign: 'center', fontSize: 20 }}>Return</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.deleteButton} onPress={() => handleDeleteProject()} underlayColor="#b00017">
          <Text style={{ textAlign: 'center', fontSize: 20 }}>Delete Project</Text>
        </TouchableHighlight>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 25,
  },
  projectTitle: {
    fontSize: 40,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  scrollContainer: {
    width: 350,
    height: 350,
    backgroundColor: '#B5E48C',
    borderRadius: 10,
  },
  addMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addMember: {
    backgroundColor: 'green',
    width: 40,
    height: 40,
    marginLeft: 20,
    borderRadius: 50,
    alignContent: 'center',
    justifyContent: 'center',
  },
  memberContainer: {
    justifyContent: 'space-between',
    backgroundColor: '#B5E48C',
    width: 350,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 30,
  },
  member: {
    flexDirection: 'row',
    backgroundColor: '#6A9B72',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    marginBottom: 5,
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
    backgroundColor: '#52B69A',
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 5,
  },
  backButton: {
    backgroundColor: '#52B69A',
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 5,
  },
  removeButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
});
