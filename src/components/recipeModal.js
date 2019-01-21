import React, { Component } from 'react';
import {
  View, FlatList, Modal, Platform, Text, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import TopBar from './TopBar';
import styles from '../Screens/Styles';

class RecipeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  chooseType(type) {
    this.props.getData(type);
    // this.props.closeRecipeModal;
  }

  renderListItems(listitem, index) {
    const recipeTypes = listitem.item;
    return (
      <TouchableOpacity
        onPress={() => this.chooseType(recipeTypes[1].type)}
        style={styles.recipeTypeItem}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{recipeTypes[1].type}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    console.log('props.recipeTypesmodal', this.props.recipeTypes);
    const { recipeTypes } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible
        onRequestClose={() => null}
      >
        <View style={styles.recipeTypeView}>
          <View style={styles.recipeTypeListView}>
            <FlatList
              data={recipeTypes}
              contentContainerStyle={styles.recipeListContainer}
              renderItem={(item, index) => this.renderListItems(item, index)}
              keyExtractor={(item, index) => item[0]}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>
          <TopBar modal onClose={this.props.closeRecipeModal} />
        </View>
      </Modal>
    );
  }
}
const mapStateToProps = state => ({
  // console.log('state.recipe',state.recipe)
  recipeTypes: state.recipe ? Object.entries(state.recipe) : [],
});
export default connect(mapStateToProps, null)(RecipeModal);
