import React, { Component } from 'react';
import { View, Image } from 'react-native';
import firebase from 'firebase';
import styles from './Styles';
import foods from '../assets/foods.jpg';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const config = {
      apiKey: 'AIzaSyD3v9vuzLkYCuETaU6fypsQF2ghoyX51mg',
      authDomain: 'recipeproject-55adf.firebaseapp.com',
      databaseURL: 'https://recipeproject-55adf.firebaseio.com',
      projectId: 'recipeproject-55adf',
      storageBucket: 'recipeproject-55adf.appspot.com',
      messagingSenderId: '255715504612',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
      // console.log('firebase', firebase);
    }


    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('tab');
      } else {
        navigation.navigate('login');
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Image style={styles.splashStyle} resizeMode="contain" source={foods} />
      </View>
    );
  }
}
