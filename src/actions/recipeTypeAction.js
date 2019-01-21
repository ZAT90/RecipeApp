import firebase from 'firebase';
import { RECIPE_TYPE_FETCH } from './types';

 // const { currentUser } = firebase.auth();
 export const recipeTypefetch = () => {
    return (dispatch) => {
      firebase.database().ref('/recipeTypes')
        .on('value', (snapshot) => {
          dispatch({ type: RECIPE_TYPE_FETCH, payload: snapshot.val() });
        });
    };
  };
