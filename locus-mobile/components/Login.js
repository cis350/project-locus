import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, TextInput, Alert } from 'react-native';
// import { verifyLogInInfo, getUserUniqueId } from '../modules/storage';

export default function Login({ navigation, routes }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // vertify user information once we have a backend
  function handleLogin() {
    if (email === '' || password === '') {
      Alert.alert('Invalid Username/Password')
    } else {
      navigation.navigate('AppNavigation');
    }
    // else if (!verifyLogInInfo(logInEmail, logInPassword)) {
    //   setLogInFieldEmpty(false);
    //   setLogInInfoInvalid(true);
    // } else {
    //   const uniqueId = getUserUniqueId(logInEmail);
    //   setLogInFieldEmpty(false);
    //   setLogInInfoInvalid(false);
    //   onLogIn(`/home/${uniqueId}`);
    // }
  }

  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center', fontSize: 40}}>Login</Text>
      <View style={styles.formContainer}>
        <TextInput style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
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
    borderColor: "gray", 
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
  }
})

// const Login = function LoginComponent({ setIsLoggedIn, setUserEmail }) {
//   const [logInEmail, setLogInEmail] = useState('');
//   const [logInPassword, setLogInPassword] = useState('');

//   const [logInFieldEmpty, setLogInFieldEmpty] = useState(false);
//   const [logInInfoInvalid, setLogInInfoInvalid] = useState(false);
//   const navigate = useNavigate();
//   // handles redirecting to "/home"
//   function onLogIn(path) {
//     navigate(path);
//     setIsLoggedIn(true);
//     setUserEmail(logInEmail);
//   }

//   const errorMsgEmptyFields = (() => (
//     // referenced https://react-bootstrap.github.io/components/alerts/
//     <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
//       Please enter both your email and password.
//     </Alert>
//   ));

//   const errorMsgLogInInfoInvalid = (() => (
//     // referenced https://react-bootstrap.github.io/components/alerts/
//     <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
//       Email or/and password invalid.
//     </Alert>
//   ));

//   return (
//     <div className="container" style={{ position: 'relative', padding: '120px' }}>
//       <h1 className="text-center">Log-in</h1>
//       {logInFieldEmpty && errorMsgEmptyFields()}
//       {logInInfoInvalid && errorMsgLogInInfoInvalid()}
//       <Card style={{
//         width: '23rem',
//         margin: 'auto',
//         marginTop: '20px',
//         borderRadius: '10px',
//         backgroundColor: '#B5E48C',
//         borderColor: '#B5E48C',
//       }}
//       >
//         <Card.Body>
//           {/* referenced https://react-bootstrap.github.io/forms/overview/ */}
//           <Form>
//             <Form.Group className="mb-3" controlId="formBasicEmail">
//               <Form.Label>Email</Form.Label>
//               <Form.Control style={{ height: '25px' }} type="email" onChange={(e) => updateEmail(e)} />
//               <Form.Label>Password</Form.Label>
//               <Form.Control style={{ height: '25px' }} type="password" onChange={(e) => updatePassword(e)} />
//             </Form.Group>
//           </Form>
//         </Card.Body>
//       </Card>
//       <div className="navbar-brand" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
//         <Button
//           style={{
//             backgroundColor: '#6A9B72',
//             width: '120px',
//             height: '50px',
//             fontWeight: 'bold',
//             fontSize: '25px',
//             color: 'black',
//             borderColor: '#6A9B72',
//           }}
//           onClick={() => processUserInputs()}
//         >
//           Log-in
//         </Button>
//       </div>
//     </div>
//   );
// };

