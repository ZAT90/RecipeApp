import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, BackHandler,
} from 'react-native';
import firebase from 'firebase';
import styles from './Styles';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: '',
      passwordText: '',
    };
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  }

  onButtonPress() {
    const { emailText, passwordText } = this.state;
    const { navigation } = this.props;

    firebase.auth().signInWithEmailAndPassword(emailText, passwordText)
      .then(() => navigation.navigate('tab'))
      .catch(() => Alert.alert(
        'Oops!',
        'Incorrect Credentials',
        [{ text: 'OK', onPress: () => console.log('ok pressed') }],

      ));
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.emailText}>Email</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Email"
            onChangeText={emailText => this.setState({ emailText })}
          />
        </View>
        <View style={{ flexDirection: 'column', marginTop: 10 }}>
          <Text style={styles.emailText}>Password</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Password"
            secureTextEntry
            onChangeText={passwordText => this.setState({ passwordText })}
          />
        </View>
        <TouchableOpacity onPress={() => this.onButtonPress()} style={styles.loginbutton}>
          <Text style={styles.loginbuttonTxt}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('signup')} style={{ marginTop: 10 }}>
          <Text style={styles.insteadText}>Sign up Instead?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
