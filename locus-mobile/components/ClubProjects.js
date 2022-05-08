import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableHighlight, Modal, Alert, TextInput, TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getClubProjects, getSpecificClub, createClubProject } from '../modules/api';
import ManageProject from './ManageProject';

function containsUser(userEmail, adminArray) {
  if (!adminArray) return false;
  for (let i = 0; i < adminArray.length; i += 1) {
    if (adminArray[i] === userEmail) return true;
  }
  return false;
}

export default function ClubProjects({ clubName, user, changeClub }) {
  const [clubProjects, setClubProjects] = useState([]);
  const [club, setClub] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(undefined);
  const [jawn, rerender] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function setProjects() {
      setClub((await getSpecificClub(clubName)).jsonContent);
      setClubProjects((await getClubProjects(clubName)).jsonContent);
    }
    setProjects();
  }, [isFocused, jawn, selectedProject]);

  async function handleCreateProject() {
    const response = await createClubProject(clubName, projectName, user.email);
    if (response.status !== 200) Alert.alert('Project Creation Failed');
    setProjectName('');
    setModalVisible(false);
    rerender(!jawn);
  }

  const displayProjects = [];
  for (let i = 0; i < clubProjects.length; i += 1) {
    displayProjects.push(
      <TouchableOpacity style={styles.club} key={`userClub${i}`} onPress={() => setSelectedProject(clubProjects[i])}>
        <Text style={styles.clubText}>{clubProjects[i].projectName}</Text>
        <Text style={styles.clubText}>Lead: {clubProjects[i].leaderEmail}</Text>
        <Ionicons
          style={{ color: 'white', textAlign: 'center', paddingVertical: 20 }}
          name="settings"
          size={24}
        />
      </TouchableOpacity>,
    );
  }

  if (selectedProject) {
    return (
      <ManageProject
        project={selectedProject}
        changeProject={setSelectedProject}
        user={user}
        club={club}
      />
    );
  }
  // render all chat if no chat was selected
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <Text style={{ fontSize: 40, marginBottom: 30 }}>Create Project</Text>
              <TextInput
                style={styles.input}
                placeholder="Project Name"
                placeholderTextColor="grey"
                onChangeText={setProjectName}
                value={projectName}
              />
              <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => handleCreateProject()}>
                <Text style={{ fontSize: 20 }}>Create</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.cancelButton} underlayColor="#33E86F" onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 20 }}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </Modal>
        </View>
        {(club && containsUser(user.email, club.admins))
          ? (
            <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => setModalVisible(true)}>
              <Text style={{ fontSize: 20 }}>Create Project</Text>
            </TouchableHighlight>
          )
          : <View />}
        <TouchableHighlight style={styles.cancelButton} onPress={() => changeClub(undefined)} underlayColor="#b00017">
          <Text style={{ textAlign: 'center', fontSize: 20 }}>Back</Text>
        </TouchableHighlight>
        {(clubProjects.length === 0) ? (
          <View />)
          : (
            <View style={styles.clubContainer}>
              {displayProjects}
            </View>
          )}
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
