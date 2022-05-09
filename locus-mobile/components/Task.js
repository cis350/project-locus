/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableHighlight, Alert, TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { deleteTask, reassignTask, getSpecificTask, updateTaskStatus } from '../modules/api';

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
    await updateTaskStatus(club.clubName, project.projectName, user.email, newStatus, task._id);
    setStatus(newStatus);
    rerender(!jawn);
  }

  // async function reassignTask(clubName, projectName, requestedEmail, targetEmail, taskId) {

  async function handleReassignTask() {
    await reassignTask(club.clubName, project.projectName, user.email, assignee, task._id);
    rerender(!jawn);
  }

  async function handleDeleteTask() {
    await deleteTask(club.clubName, project.projectName, user.email, task._id);
    Alert.alert('Task Deleted');
    setSelectedTask(undefined);
  }

  const statusPicker = (
    <Picker
      selectedValue={status}
      style={{ height: 150, width: 300, marginBottom: 40 }}
      onValueChange={(itemValue) => handleUpdateStatus(itemValue)}
    >
      <Picker.Item label="Incomplete" value="incomplete" />
      <Picker.Item label="Need Help" value="need help" />
      <Picker.Item label="Done" value="done" />
    </Picker>
  );

  const assigneeChanger = (
    <View style={styles.reassignContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="grey"
        onChangeText={setAssignee}
        value={assignee}
      />
      <TouchableHighlight style={styles.reassignButton} onPress={() => handleReassignTask()} underlayColor="#33E86F">
        <Text style={{ fontSize: 20 }}>Reassign</Text>
      </TouchableHighlight>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.taskCard}>
        <View style={styles.taskContainer}>
          <Text style={styles.taskTitle}>{currTask.taskName}</Text>
          <Text style={styles.taskTitle}>Assigned: {currTask.assignedTo}</Text>
          <Text style={styles.taskTitle}>Status: {currTask.status}</Text>
        </View>
        {(currTask.assignedTo === user.email || user.email === project.leaderEmail)
          ? statusPicker : <View />}
        {(user.email === project.leaderEmail) ? assigneeChanger : <View />}
      </View>
      <TouchableHighlight style={styles.button} onPress={() => setSelectedTask(undefined)} underlayColor="#33E86F">
        <Text style={{ fontSize: 20 }}>Return</Text>
      </TouchableHighlight>
      {(user.email === project.leaderEmail)
        ? (
          <TouchableHighlight style={styles.removeButton} onPress={() => handleDeleteTask()} underlayColor="red">
            <Text style={{ fontSize: 20 }}>Delete</Text>
          </TouchableHighlight>
        ) : <View />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 25,
  },
  taskTitle: {
    width: 350,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: '#B5E48C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
  },
  taskContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
  reassignContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'gray',
    width: 200,
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
  reassignButton: {
    backgroundColor: '#52B69A',
    borderRadius: 10,
    paddingVertical: 7,
    width: 120,
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
