import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableHighlight, TextInput, Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getClubChat, sendMessage } from '../modules/api';

// get messages from currentChat once backend is available
export default function Chat({ currentChat, backToAllChat, user }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [content, setContent] = useState('');
  const scrollViewRef = useRef();

  // setup all messages and async calls to get all messages every 2 seconds
  useEffect(() => {
    async function fetchMessages() {
      setChatMessages((await getClubChat(currentChat)).jsonContent);
    }
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // handle send message
  const isValidUrl = (url) => {
    try {
      const f = new URL(url);
      if (f) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return true;
  };

  const displayContent = (image) => {
    if (image === '' || !isValidUrl(image)) {
      return false;
    }
    return true;
  };

  const getTime = ((dateMilli) => {
    const date = new Date(dateMilli);
    const hour = date.getHours();
    let minute = date.getMinutes();
    if (minute < 10) minute = `0${minute}`;
    return `${hour}:${minute}`;
  });
  const getDate = ((dateMilli) => {
    const date = new Date(dateMilli);
    const year = date.getFullYear();
    const month = ((date.getMonth() + 1).toString()).slice(-2);
    const day = (date.getDate().toString()).slice(-2);
    return `${month}-${day}-${year}`;
  });

  // function that will send the message the user types, update for backend later
  async function handleSendMessage() {
    if (message === '' && content === '') return;
    if (/\S/.test(message)) {
      // TODO: pass date as milliseconds, update content to image content
      await sendMessage(currentChat, user.email, message, content, (new Date()).getTime());
    }
    setChatMessages((await getClubChat(currentChat)).jsonContent);
    setMessage('');
    setContent('');
  }

  // setup messages view for specific chat
  const displayMessages = [];
  for (let i = 0; i < chatMessages.length; i += 1) {
    // align right if you are the sender
    if (chatMessages[i].userEmail === user.email) {
      displayMessages.push(
        <View style={{ alignItems: 'flex-end' }} key={`message${i}`}>
          {displayContent(chatMessages[i].content)
            ? <Image source={{ uri: chatMessages[i].content }} style={styles.img} /> : <View /> }
          <View style={styles.textBubble}>
            <Text style={{ fontSize: 15 }}>{chatMessages[i].message}</Text>
          </View>
          <Text style={{ fontSize: 10 }}>{chatMessages[i].fullName}</Text>
          <Text style={{ fontSize: 10 }}>{getDate(chatMessages[i].timeStamp)}</Text>
          <Text style={{ fontSize: 10 }}>{getTime(chatMessages[i].timeStamp)}</Text>
        </View>,
      );
    } else { // align left if you are not the sender
      displayMessages.push(
        <View style={{ alignItems: 'flex-start' }} key={`message${i}`}>
          {displayContent(chatMessages[i].content)
            ? <Image source={{ uri: chatMessages[i].content }} style={styles.img} /> : <View /> }
          <View style={styles.textBubble}>
            <Text style={{ fontSize: 15 }}>{chatMessages[i].message}</Text>
          </View>
          <Text style={{ fontSize: 10 }}>{chatMessages[i].fullName}</Text>
          <Text style={{ fontSize: 10 }}>{getDate(chatMessages[i].timeStamp)}</Text>
          <Text style={{ fontSize: 10 }}>{getTime(chatMessages[i].timeStamp)}</Text>
        </View>,
      );
    }
  }
  displayMessages.push(<View style={{ marginBottom: 25 }} key="spacefiller" />);

  return (
    <KeyboardAwareScrollView scrollToEnd={{ animated: true }}>
      <View style={styles.container}>
        <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => backToAllChat()}>
          <Text style={{ fontSize: 28, color: 'white' }}>All Chats</Text>
        </TouchableHighlight>
        <Text style={{ fontSize: 28 }}>Current Chat</Text>
        <ScrollView
          style={styles.messagesContainer}
          // https://stackoverflow.com/questions/29310553/is-it-possible-to-keep-a-scrollview-scrolled-to-the-bottom
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {displayMessages}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor="grey"
            onChangeText={setMessage}
            onSubmitEditing={() => handleSendMessage()}
            value={message}
          />
          <TextInput
            style={styles.input}
            placeholder="Image Link"
            placeholderTextColor="grey"
            onChangeText={setContent}
            onSubmitEditing={() => handleSendMessage()}
            value={content}
          />
          <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => handleSendMessage()}>
            <Text style={{ fontSize: 28, color: 'white' }}>Send Message</Text>
          </TouchableHighlight>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#6A9B72',
    borderRadius: 10,
    paddingVertical: 10,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  inputContainer: {
    alignItems: 'center',
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
  img: {
    width: 100,
    height: 100,
  },
});
