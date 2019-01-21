import React, { Component } from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import firebase from 'firebase';
import TopBar from '../components/TopBar';
import styles from './Styles';

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  }

  onLogOut() {
    firebase.auth().signOut();
    this.props.navigation.navigate('login');
  }

  render() {
    const { currentUser } = firebase.auth();
    return (
      <View>
        <View style={styles.addContainer}>
          <View style={styles.userEmailContainer}>
            <Text style={styles.headerText}>Your Email</Text>
            <Text style={styles.recipeInput}>{currentUser.email}</Text>
          </View>
          <TouchableOpacity onPress={() => this.onLogOut()} style={styles.addRecipeButton}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
        <TopBar AddScreen title="Profile" />
      </View>
    );
  }
}
