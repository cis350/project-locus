/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableHighlight, Alert, TextInput, Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { deleteTask, reassignTask, getSpecificTask, updateTaskStatus } from '../modules/api';

const statuses = ['incomplete', 'need help', 'done'];

export default function Task({ project, task, setSelectedTask, user, club }) {
  const [status, setStatus] = useState(task.status);
  const [assignee, setAssignee] = useState(task.assignedTo);
  const [currTask, setCurrTask] = useState(task);
  const [jawn, rerender] = useState(false);

  useEffect(() => {
    async function setTask() {
      setCurrTask(
        (await getSpecificTask(club.clubName, project.projectName, user.email, task._id))
          .jsonContent.result,
      );
    }
    setTask();
  }, [jawn]);

  async function handleUpdateStatus(newStatus) {
    Alert.alert('Status Updated');
    await updateTaskStatus(club.clubName, project.projectName, user.email, newStatus, task._id);
    setStatus(newStatus);
    rerender(!jawn);
  }
  async function handleReassignTask() {
    Alert.alert('Task Reassigned');
  }
  async function handleDeleteTask() {
    await deleteTask(club.clubName, project.projectName, user.email, task.id);
  }

  const statusPicker = (
    <Picker
      selectedValue={status}
      style={{ height: 300, width: 150 }}
      onValueChange={(itemValue) => handleUpdateStatus(itemValue)}
    >
      <Picker.Item label="Incomplete" value="incomplete" />
      <Picker.Item label="Need Help" value="need help" />
      <Picker.Item label="Done" value="done" />
    </Picker>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.taskTitle}>{currTask.taskName}</Text>
      <Text style={styles.taskTitle}>{currTask.assignedTo}</Text>
      <Text style={styles.taskTitle}>{currTask.status}</Text>
      {statusPicker}
      <TouchableHighlight style={styles.button} onPress={() => setSelectedTask(undefined)}>
        <Text>Delete</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.button} onPress={() => setSelectedTask(undefined)}>
        <Text>Update Status</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.button} onPress={() => setSelectedTask(undefined)}>
        <Text>Return</Text>
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
  addMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    width: 200,
    fontSize: 20,
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
  removeButton: {
    backgroundColor: 'red',
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
