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
    Alert.alert('Status Updated');
    await updateTaskStatus(club.clubName, project.projectName, user.email, newStatus, task._id);
    setStatus(newStatus);
    rerender(!jawn);
  }

  // async function reassignTask(clubName, projectName, requestedEmail, targetEmail, taskId) {

  async function handleReassignTask() {
    Alert.alert('Reassign Task');
    await reassignTask(club.clubName, project.projectName, user.email, assignee, task._id);
    rerender(!jawn);
  }

  async function handleDeleteTask() {
    await deleteTask(club.clubName, project.projectName, user.email, task._id);
    setSelectedTask(undefined);
  }

  const statusPicker = (
    <Picker
      selectedValue={status}
      style={{ height: 200, width: 300 }}
      onValueChange={(itemValue) => handleUpdateStatus(itemValue)}
    >
      <Picker.Item label="Incomplete" value="incomplete" />
      <Picker.Item label="Need Help" value="need help" />
      <Picker.Item label="Done" value="done" />
    </Picker>
  );

  const assigneeChanger = (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="grey"
        onChangeText={setAssignee}
        value={assignee}
      />
      <TouchableHighlight style={styles.button} onPress={() => handleReassignTask()}>
        <Text>Reassign</Text>
      </TouchableHighlight>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.taskTitle}>Task Name: {currTask.taskName}</Text>
      <Text style={styles.taskTitle}>Assigned To: {currTask.assignedTo}</Text>
      <Text style={styles.taskTitle}>Status: {currTask.status}</Text>
      {(currTask.assignedTo === user.email || user.email === project.leaderEmail)
        ? statusPicker : <View />}
      {(user.email === project.leaderEmail) ? assigneeChanger : <View />}
      {(user.email === project.leaderEmail)
        ? (
          <TouchableHighlight style={styles.button} onPress={() => handleDeleteTask()}>
            <Text>Delete</Text>
          </TouchableHighlight>
        ) : <View />}
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
