import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddScreen from './Screens/AddScreen';
import ListScreen from './Screens/ListScreen';
import SplashScreen from './Screens/SplashScreen';
import LoginScreen from './Screens/LoginScreen';
import UpdateScreen from './Screens/UpdateScreen';
import ProfileScreen from './Screens/ProfileScreen';
import SignUp from './Screens/Signup';

const TabNavigator = createBottomTabNavigator({
  List: ListScreen,
  Add: AddScreen,
  Settings: ProfileScreen,
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'List') {
        iconName = 'ios-list-box';
      } else if (routeName === 'Add') {
        iconName = 'ios-add-circle-outline';
      } else if (routeName === 'Settings') {
        iconName = 'ios-settings';
      }

      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: 'green',
    inactiveTintColor: 'gray',
  },
});

const AuthNavigator = createStackNavigator({
  splash: {
    screen: SplashScreen,
  },
  login: {
    screen: LoginScreen,
  },
  signup: {
    screen: SignUp,
  }
},
{
  headerMode: 'none',
});

const StackNavigator = createStackNavigator({
  auth: AuthNavigator,
  tab: TabNavigator,
  update: {
    screen: UpdateScreen,
  },
}, {

  headerMode: 'none',
});

export default StackNavigator;
