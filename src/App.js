import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createAppContainer } from 'react-navigation';
import reducers from './reducers';
import StackNavigator from './AppNavigator';

const AppContainer = createAppContainer(StackNavigator);

export default class App extends Component {
  render() {
    console.disableYellowBox = true;
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <SafeAreaView style={{ flex: 1 }}>
          <AppContainer />
        </SafeAreaView>
      </Provider>

    );
  }
}