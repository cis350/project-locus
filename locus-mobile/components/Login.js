import React, { useState } from 'react';
import {
  View, TouchableHighlight, Text, StyleSheet, TextInput, Alert,
} from 'react-native';
import { login, getUser } from '../modules/api';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const loginStatus = await login(email, password);
    if (loginStatus === 404) {
      Alert.alert('Invalid Username');
    } else if (loginStatus === 400) {
      Alert.alert('Invalid Password');
    } else if (loginStatus === 403) {
      Alert.alert('Account Locked, Try Again Later');
    } else {
      const user = (await getUser(email)).result;
      if (!user) return;
      navigation.navigate('TabNavigation', { user });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center', fontSize: 40 }}>Login</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="grey"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="grey"
          onChangeText={setPassword}
          value={password}
          // eslint-disable-next-line react/jsx-boolean-value
          secureTextEntry={true}
        />
      </View>
      <TouchableHighlight style={styles.button} underlayColor="#33E86F" onPress={() => handleLogin()}>
        <Text style={{ fontSize: 30 }}>Login</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 100,
  },
  formContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#B5E48C',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 30,
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
    marginHorizontal: 10,
  },
});
