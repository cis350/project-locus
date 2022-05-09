/* eslint-disable object-curly-newline */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableHighlight, Alert, TextInput, Modal,
} from 'react-native';
import { getAllTasksForProject, createTask } from '../modules/api';
import Task from './Task';

export default function ManageTasks({ project, setManagingTask, user, club }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [jawn, rerender] = useState(false);
  const [tasks, setTasks] = useState(project.tasks);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [selectedTask, setSelectedTask] = useState(undefined);

  useEffect(() => {
    async function getTasks() {
      setTasks((await getAllTasksForProject(club.clubName, project.projectName, user.email))
        .jsonContent);
    }
    getTasks();
  }, [jawn]);

  async function handleCreateTask() {
    const response = await (
      createTask(
        club.clubName,
        project.projectName,
        newTaskName,
        user.email,
        newTaskAssignee,
        'incomplete',
      ));
    setNewTaskName('');
    setNewTaskAssignee('');
    setModalVisible(false);
    if (response.status === 200) Alert.alert('Task Successfully Created');
    else Alert.alert('Task Creation Failed');
    rerender(!jawn);
  }

  const displayTasks = [];
  for (let i = 0; i < tasks.length; i += 1) {
    console.log(tasks[i]);
    displayTasks.push(
      <View style={styles.task} key={`task${i}`}>
        <Text style={styles.taskTitle}>sdaoifjaosdfjoasdjfosjdfoiasjdfoaiojsfd</Text>
        <TouchableHighlight style={styles.viewButton} onPress={() => Alert.alert('pressed')} underlayColor="#b00017">
          <Text style={{ textAlign: 'center', fontSize: 15, color: 'white' }}>View</Text>
        </TouchableHighlight>
      </View>,
    );
  }

  if (selectedTask) {
    return (
      <Task
        task={selectedTask}
        setSelectedTask={setSelectedTask}
        user={user}
        project={project}
      />
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <Text style={{ fontSize: 40, marginBottom: 30 }}>Create Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task Name"
              placeholderTextColor="grey"
              onChangeText={setNewTaskName}
              value={newTaskName}
            />
            <TextInput
              style={styles.input}
              placeholder="Assignee Email"
              placeholderTextColor="grey"
              onChangeText={setNewTaskAssignee}
              value={newTaskAssignee}
            />
            <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => handleCreateTask()}>
              <Text style={{ fontSize: 20 }}>Create</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.cancelButton} underlayColor="#33E86F" onPress={() => setModalVisible(false)}>
              <Text style={{ fontSize: 20 }}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      </View>
      <Text style={styles.projectTitle}>Tasks</Text>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.memberContainer}>
          {displayTasks}
        </View>
      </ScrollView>
      <TouchableHighlight style={styles.button} onPress={() => setModalVisible(true)} underlayColor="#b00017">
        <Text style={{ textAlign: 'center', fontSize: 20 }}>Create Tasks</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.backButton} onPress={() => setManagingTask(false)} underlayColor="#b00017">
        <Text style={{ textAlign: 'center', fontSize: 20 }}>Back</Text>
      </TouchableHighlight>
    </View>
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
    height: 400,
    backgroundColor: '#B5E48C',
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  taskTitle: {
    width: 200,
    fontSize: 15,
  },
  memberContainer: {
    justifyContent: 'space-between',
    backgroundColor: '#B5E48C',
    width: 350,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 30,
  },
  task: {
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
  viewButton: {
    backgroundColor: '#52B69A',
    borderRadius: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
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
