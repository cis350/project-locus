import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import Chat from './Chat';
import { getUserClubs } from '../modules/api';

export default function AllChats({ route }) {
  // use state to switch between different chats
  const { user } = route.params;
  const [allChats, setAllChats] = useState([]);
  const [currentChat, changeChat] = useState(null);

  // load all the user chats on render
  useEffect(() => {
    async function initialize() {
      setAllChats((await getUserClubs(user.email)).jsonContent);
    }
    initialize();
  }, []);

  // setup view for all chats
  const displayAllChats = [];
  for (let i = 0; i < allChats.length; i += 1) {
    displayAllChats.push(
      <TouchableOpacity style={styles.allChats} key={`chat${i}`} onPress={() => changeChat(allChats[i].clubName)}>
        <Text style={{ fontSize: 28, color: 'white' }}>{allChats[i].clubName}</Text>
      </TouchableOpacity>,
    );
  }

  // helper function that lets user come back to all chat view
  const backToAllChat = () => changeChat(null);

  // render the selected chat
  if (currentChat) {
    return <Chat backToAllChat={backToAllChat} currentChat={currentChat} user={user} />;
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
