import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, Image, BackHandler,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { recipeTypefetch } from '../actions';
import styles from './Styles';
import RecipeModal from '../components/recipeModal';
import TopBar from '../components/TopBar';
import noitemfound from '../assets/noitemfound.png';
import Loader from '../components/Loader';


class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      recipeType: '',
      allRecipeData: null,
      listData: null,
      isFetching: false,
    };
  }

  componentDidMount() {
    this.props.recipeTypefetch();
    this.getAllRecipes();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  }


  onRefresh() {
    this.setState({ isFetching: true }, () => {
      this.getAllRecipes();
    });
  }

  // use this function to call the recipes table from firebase
  getAllRecipes() {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/Recipes/${currentUser.uid}`)
      .on('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({
            listData: Object.entries(snapshot.val()), allRecipeData: Object.entries(snapshot.val()), isFetching: false, recipeType: '',
          });
        } else {
          this.setState({
            listData: [], allRecipeData: [], isFetching: false, recipeType: '',
          });
        }
      });
  }

  setModalVisible(visible) {
    this.setState({ showModal: visible });
  }

  handleFilter(recipeType) {
    const { allRecipeData } = this.state;
    const filteredData = allRecipeData.filter(recipeData => recipeData[1].recipeType === recipeType);
    this.setState({ recipeType, listData: filteredData });
  }


  deleteRecipe(itemId) {
    const { currentUser } = firebase.auth();
    firebase.database().ref('Recipes').child(`${currentUser.uid}/${itemId}`).remove();
  }

  renderListItem(data) {
    const listItem = data.item;
    return (
      <View style={styles.recipeListItem}>
        <View style={styles.recipeListItemleft}>
          <Text style={styles.recipeListItemleftText}>{listItem[1].recipeName}</Text>
          <Text>{listItem[1].recipeType}</Text>
        </View>
        <View style={styles.recipeListItemRight}>
          <Image
            source={{ uri: listItem[1].imageUrl }}
            style={styles.recipeListImage}
          />
        </View>
      </View>
    );
  }

  renderHiddenButtons(data) {
    const { navigation } = this.props;
    const listItem = data.item;
    return (
      <View style={styles.hiddenButtonContainer}>
        <TouchableOpacity onPress={() => this.deleteRecipe(listItem[0])} style={styles.recipeListHiddenLeft}>
          <View style={styles.recipeListHiddenMarginLeft}><Ionicons name="ios-trash" size={40} color="black" /></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('update', { listItem })} style={styles.recipeListHiddenRight}>
          <View style={styles.recipeListHiddenMarginRight}><Ionicons name="ios-create" size={40} color="black" /></View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { listData } = this.state;
    return (
      <View style={styles.recipeListView}>
        <View style={styles.addContainer}>
          <Text style={styles.headerText}>Select a type</Text>
          <TouchableOpacity onPress={() => this.setModalVisible(true)} style={[styles.pickerModalTextContainer, { backgroundColor: 'white' }]}>
            <View style={styles.recipeTypeLeft}><Text>{this.state.recipeType}</Text></View>
            <View style={styles.recipeTypeRight}><Ionicons name="ios-arrow-dropdown" size={20} color="black" /></View>
          </TouchableOpacity>
          { listData !== null && listData.length > 0 && (
          <SwipeListView
            useFlatList
            style={styles.swipeListStyle}
            contentContainerStyle={styles.swipeListContainerStyle}
            refreshing={this.state.isFetching}
            onRefresh={() => this.onRefresh()}
            data={this.state.listData}
            keyExtractor={(data, index) => data[0]}
            renderItem={(data, rowMap) => (
              this.renderListItem(data)
            )}
            renderHiddenItem={(data, rowMap) => (
              this.renderHiddenButtons(data)
            )}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
          )}
          { listData !== null && listData.length === 0
            && <Image resizeMode="contain" style={styles.noItemFoundImage} source={noitemfound} />
          }
          <Loader
            loading={this.state.listData === null ? true : false}
          />

          {this.state.showModal
          && <RecipeModal getData={(recipeType) => { this.handleFilter(recipeType); this.setModalVisible(false); }} closeRecipeModal={() => this.setModalVisible(false)} />}
        </View>
        <TopBar AddScreen title="Recipes" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  recipeTypes: state.recipe ? Object.entries(state.recipe) : [],
});
export default connect(mapStateToProps, { recipeTypefetch })(ListScreen);
