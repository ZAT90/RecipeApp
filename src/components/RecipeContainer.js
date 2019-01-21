import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView, Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tags from 'react-native-tags';
import styles from '../Screens/Styles';
import RecipeModal from './recipeModal';
import noImage from '../assets/noimage.png';

export default class RecipeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { 
      imageurl, uploadUri, recipeType, recipeName, tags, steps, setRecipeType, setRecipeName, setTags, setSteps, setModalVisibility, openGallery, openCamera, onSubmit, showModal  
    } = this.props;
    return (
      <ScrollView style={styles.addContainer} contentContainerStyle={{ paddingBottom: 50 }}>
        <Text style={styles.headerText}>Select a type</Text>
        <TouchableOpacity onPress={() => setModalVisibility(true)} style={styles.pickerModalTextContainer}>
          <View style={styles.recipeTypeLeft}><Text>{recipeType}</Text></View>
          <View style={styles.recipeTypeRight}><Ionicons name="ios-arrow-dropdown" size={20} color="black" /></View>
        </TouchableOpacity>
        <View style={styles.recipeNameContainer}>
          <Text style={styles.headerText}>Recipe Name</Text>
          <TextInput
            style={styles.recipeInput}
            value={recipeName}
            placeholder="Sushi Pasta"
            onChangeText={recipeName => setRecipeName(recipeName)}
          />
        </View>
        <View style={styles.marginContainer}>
          <Text style={styles.headerText}>Ingredients</Text>
          <Tags
            createTagOnString={['.']}
            createTagOnReturn
            maxNumberOfTags={20}
            textInputProps={{
              placeholder: 'List the ingredients',
              selectionColor: 'white',
              placeholderTextColor: 'white',
            }}
            initialTags={tags}
            onChangeTags={tags => setTags(tags)}
            onTagPress={(index, tagLabel, event, deleted) => console.log(index, tagLabel, event, deleted ? 'deleted' : 'not deleted')
    }
            containerStyle={styles.tagContainer}
            inputStyle={styles.tagInput}
          />
        </View>
        <View style={styles.marginContainer}>
          <Text style={styles.headerText}>Steps</Text>
          <View style={styles.stepsContainer}>
            <TextInput
              multiline
              returnKeyType="done"
              value={steps}
              onChangeText={steps => setSteps(steps)}
              style={styles.stepsText}
              placeholder="1. add some salt"
            />
          </View>
        </View>
        <View style={styles.marginContainer}>
          <Text style={styles.headerText}>Upload an Image</Text>
          <View style={styles.rowContainer}>
            <View style={styles.imageView}>
              <Image resizeMode="contain" style={styles.imagestyle} source={imageurl === '' ? noImage : { uri: uploadUri }} />
            </View>
            <View style={styles.imageUploadContainer}>
              <TouchableOpacity onPress={() => openGallery()} style={styles.imagebuttonstyle}>
                <Text style={styles.uploadText}>Select From Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openCamera()} style={styles.imagebuttonstyle}>
                <Text style={styles.uploadText}>Open Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => onSubmit()} style={styles.addRecipeButton}>
            <Text style={styles.submitBtnStyle}>Submit</Text>
          </TouchableOpacity>
        </View>
        {showModal
          && (
          <RecipeModal
            getData={(recipeType) => { setRecipeType(recipeType); setModalVisibility(false); }}
            closeRecipeModal={() => setModalVisibility(false)}
          />
          )}
      </ScrollView>
    );
  }
}
