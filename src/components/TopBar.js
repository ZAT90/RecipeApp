import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Screens/Styles';

export default class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.topbarContainer}>
        { this.props.AddScreen && (
        <View style={styles.topbarView}>
          <Text style={styles.topbarViewText}>
            {' '}
            {this.props.title}
            {' '}
          </Text>
        </View>
        )
    }
        { this.props.modal && (
        <View style={styles.topbarView2}>
          <TouchableOpacity onPress={this.props.onClose} style={styles.topbarView2touchContainer}><Ionicons name="ios-close" size={40} color="white" /></TouchableOpacity>
          <View style={styles.recipeTypeLeft}>
            <Text style={styles.topbarViewText}> Choose Recipe Type </Text>
          </View>
        </View>
        )
    }
        { this.props.UpdateScreen && (
        <View style={styles.topbarView2}>
          <TouchableOpacity onPress={this.props.onClose} style={styles.topbarView2touchContainer}><Ionicons name="ios-arrow-back" size={30} color="white" /></TouchableOpacity>
          <View style={styles.recipeTypeLeft2}>
            <Text style={styles.topbarViewText2}>
              {' '}
              {this.props.title}
              {' '}
            </Text>

          </View>
        </View>
        )
    }

      </View>
    );
  }
}
