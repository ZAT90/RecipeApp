import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, BackHandler,
} from 'react-native';
import firebase from 'firebase';
import styles from './Styles';
import Loader from '../components/Loader';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: '',
      passwordText: '',
      loading: false,
    };
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('login')
    return true;
  }


  onButtonPress() {
    this.setState({ loading: true });
    const { emailText, passwordText } = this.state;

    firebase.auth().createUserWithEmailAndPassword(emailText, passwordText)
      .then(() => firebase.auth().signInWithEmailAndPassword(emailText, passwordText)
        .then(() => this.navigate()))
      .catch(() => Alert.alert(
        'Oops!',
        'Unable to create user',
        [{ text: 'OK', onPress: () => console.log('ok pressed') }],

      ));
  }

  navigate() {
    this.setState({ loading: false });
    const { navigation } = this.props;
    navigation.navigate('tab');
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <Loader
          loading={this.state.loading}
        />
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
          <Text style={styles.loginbuttonTxt}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={{ marginTop: 10 }}>
          <Text style={styles.insteadText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
