import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import Chat from './Chat';

// setup all people user has a chat with
const allChats = ['Bobby', 'Tim', 'Mom', 'Dad'];

export default function AllChats() {
  // use state to switch between different chats
  const [currentChat, changeChat] = useState(null);

  // setup view for all chats
  const displayAllChats = [];
  for (let i = 0; i < allChats.length; i += 1) {
    displayAllChats.push(
      <TouchableOpacity style={styles.allChats} key={`chat${i}`} onPress={() => changeChat(allChats[i])}>
        <Text style={{ fontSize: 28, color: 'white' }}>Message: {allChats[i]}</Text>
      </TouchableOpacity>,
    );
  }

  // helper function that lets user come back to all chat view
  const backToAllChat = () => changeChat(null);

  // render the selected chat
  if (currentChat) {
    return <Chat backToAllChat={backToAllChat} currentChat={currentChat} />;
  }

  // render all chat if no chat was selected
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>Messages</Text>
        <View style={styles.allChatContainer}>
          {displayAllChats}
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
