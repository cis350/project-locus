import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableHighlight, TextInput,
} from 'react-native';

const testMessages = [{ sender: 'Bobby', message: 'hello' }, { sender: 'Mom', message: 'Bye' }];

// get messages from currentChat once backend is available
export default function Chat({ currentChat, backToAllChat }) {
  const [chatMessages, setChatMessages] = useState(testMessages);
  const [message, setMessage] = useState('');

  // setup messages view for specific chat
  const displayMessages = [];
  for (let i = 0; i < chatMessages.length; i += 1) {
    // align right if you are the sender, have to switch logic later
    if (chatMessages[i].sender === 'Me') {
      displayMessages.push(
        <View style={{ alignItems: 'flex-end' }} key={`message${i}`}>
          <Text style={{ fontSize: 10 }}>{chatMessages[i].sender}</Text>
          <View style={styles.textBubble}>
            <Text style={{ fontSize: 15 }}>{chatMessages[i].message}</Text>
          </View>
        </View>,
      );
    } else { // align left if you are not the sender
      displayMessages.push(
        <View style={{ alignItems: 'flex-start' }} key={`message${i}`}>
          <Text style={{ fontSize: 10 }}>{chatMessages[i].sender}</Text>
          <View style={styles.textBubble}>
            <Text style={{ fontSize: 15 }}>{chatMessages[i].message}</Text>
          </View>
        </View>,
      );
    }
  }

  // function that will send the message the user types, update for backend later
  function handleSendMessage() {
    if (message === '') return;
    setChatMessages([...chatMessages, { sender: 'Me', message }]);
    setMessage('');
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 28 }}>Current Chat</Text>
      <ScrollView style={styles.messagesContainer}>
        {displayMessages}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          onChangeText={setMessage}
          value={message}
        />
        <TouchableHighlight style={styles.sendButton} underlayColor="#33E86F" onPress={() => handleSendMessage()}>
          <Text style={{ textAlign: 'center' }}>Send</Text>
        </TouchableHighlight>
      </View>
      <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => backToAllChat()}>
        <Text style={{ fontSize: 28, color: 'white' }}>All Chats</Text>
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
  messagesContainer: {
    marginTop: 5,
    backgroundColor: '#B5E48C',
    height: 300,
    width: 350,
    borderRadius: 10,
    padding: 20,
  },
  textBubble: {
    backgroundColor: '#6A9B72',
    borderRadius: 10,
    padding: 5,
    maxWidth: 250,
  },
  sendButton: {
    backgroundColor: '#6A9B72',
    borderRadius: 10,
    width: 100,
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
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
});
