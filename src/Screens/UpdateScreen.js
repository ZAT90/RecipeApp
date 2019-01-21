import React, { Component } from 'react';
import {
  View, Platform, Alert, BackHandler
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import firebase from 'firebase';
import TopBar from '../components/TopBar';
import RecipeContainer from '../components/RecipeContainer';
import Loader from '../components/Loader';


export default class UpdateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeType: '',
      recipeName: '',
      tags: ['sugar', 'salt'],
      steps: '',
      imageurl: '',
      imageName: '',
      showModal: false,
      itemId: '',
      loading: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const itemDetails = navigation.getParam('listItem', 'some details');
    if (itemDetails) {
      this.setState({
        recipeType: itemDetails[1].recipeType,
        recipeName: itemDetails[1].recipeName,
        tags: itemDetails[1].tags,
        steps: itemDetails[1].steps,
        imageurl: itemDetails[1].imageUrl,
        itemId: itemDetails[0],
      });
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { navigation } = this.props;
    navigation.navigate('List');
    return true;
  }


  onSubmitPress() {
    this.setState({ loading: true });
    const {
      imageurl, recipeName, tags, steps, recipeType, itemId,
    } = this.state;
    const { navigation } = this.props;
    const { currentUser } = firebase.auth();

    if (imageurl !== '' && recipeName !== '' && tags !== [] && steps !== '' && recipeType !== '') {
      if (imageurl.includes('https://') || imageurl.includes('http://')) {
        firebase.database().ref('Recipes').child(`${currentUser.uid}/${itemId}`).update({
          recipeName, steps, tags, recipeType,
        })
          .then(() => {
            this.setState({ loading: false });
            navigation.navigate('List');
          });
      } else {
        this.uploadImageandSubmit(itemId, recipeName, tags, steps, recipeType, imageurl);
      }
    } else {
      this.setState({ loading: false });
      Alert.alert(
        'Oops!',
        'Please upload your recipe image and fill in all details required',
        [{ text: 'OK', onPress: () => console.log('ok pressed') }],

      );
    }
  }

  setModalVisible(visible) {
    this.setState({ showModal: visible });
  }

  openGallery() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      const sessionId = new Date().getTime();
      if (Platform.OS === 'ios') {
        this.setState({ imageName: sessionId + image.filename, imageurl: image.sourceURL });
      } else {
        this.setState({ imageName: `${sessionId}androidImg.png`, imageurl: image.path });
      }
    });
  }

  openCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      const sessionId = new Date().getTime();
      if (Platform.OS === 'ios') {
        this.setState({ imageName: sessionId + image.filename, imageurl: image.sourceURL });
      } else {
        this.setState({ imageName: `${sessionId}androidImg.png`, imageurl: image.path });
      }
    });
    // this.uploadImage(this.state.imageurl);
  }

  uploadImageandSubmit(itemId, recipeName, tags, steps, recipeType, uri, mime = 'image/jpeg') {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;
    const { currentUser } = firebase.auth();
    const { navigation } = this.props;

    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      // const uploadUri = uri;
      // const sessionId = new Date().getTime();
      let uploadBlob = null;
      const imageRef = firebase.storage().ref('images').child(this.state.imageName);

      fs.readFile(uploadUri, 'base64')
        .then(data => Blob.build(data, { type: `${mime};BASE64` }))
        .then((blob) => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then((imageUrl) => {
          resolve(imageUrl);
          firebase.database().ref('Recipes').child(`${currentUser.uid}/${itemId}`).update({
            recipeName,
            tags,
            steps,
            recipeType,
            imageUrl,
          })
            .then((data) => {
            // success callback
              this.setState({
                recipeType: '',
                recipeName: '',
                tags: ['sugar', 'salt'],
                steps: '',
                imageurl: '',
                imageName: '',
                loading: false,
              }, () => {
                navigation.navigate('List');
              });
            })
            .catch((error) => {
              this.setState({ loading: false });
              Alert.alert(
                'Oops!',
                'Server Error',
                [{ text: 'OK', onPress: () => console.log('ok pressed') }],

              );
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


  render() {
    const {
      imageurl, recipeType, recipeName, tags, steps, showModal,
    } = this.state;
    let uploadUri = '';
    if (imageurl !== '' || imageurl !== undefined) {
      if (imageurl.includes('https://') || imageurl.includes('http://')) {
        uploadUri = imageurl;
      } else {
        uploadUri = Platform.OS === 'ios' ? imageurl.replace('file://', '') : imageurl;
      }
    }

    return (
      <View>
        <Loader
          loading={this.state.loading}
        />
        <RecipeContainer
          imageurl={imageurl}
          uploadUri={uploadUri}
          recipeType={recipeType}
          recipeName={recipeName}
          tags={tags}
          steps={steps}
          showModal={showModal}
          setRecipeType={recipeType => this.setState({ recipeType })}
          setRecipeName={recipeName => this.setState({ recipeName })}
          setTags={tags => this.setState({ tags })}
          setSteps={steps => this.setState({ steps })}
          setModalVisibility={visibility => this.setModalVisible(visibility)}
          openGallery={() => this.openGallery()}
          openCamera={() => this.openCamera()}
          onSubmit={() => this.onSubmitPress()}
        />
        <TopBar UpdateScreen title="Update Recipe" onClose={() => this.props.navigation.navigate('tab')} />
      </View>
    );
  }
}
