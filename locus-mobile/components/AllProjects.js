import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import Chat from './Chat';

// setup all people user has a chat with
const allProjects = ['Project1', 'Project2', 'Project3', 'Project4'];

export default function AllProjects() {
  // use state to switch between different chats
  const [currentProject, changeChat] = useState(null);

  // setup view for all chats
  const displayAllProjects = [];
  for (let i = 0; i < allProjects.length; i += 1) {
    displayAllProjects.push(
      <TouchableOpacity style={styles.allChats} key={`chat${i}`} onPress={() => changeChat(allProjects[i])}>
        <Text style={{ fontSize: 28, color: 'white' }}>{allProjects[i]}</Text>
      </TouchableOpacity>,
    );
  }

  // helper function that lets user come back to all chat view
  const backToAllChat = () => changeChat(null);

  // render the selected chat
  if (currentProject) {
    return <Chat backToAllChat={backToAllChat} currentChat={currentProject} />;
  }

  // render all chat if no chat was selected
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>Projects</Text>
        <View style={styles.allChatContainer}>
          {displayAllProjects}
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
