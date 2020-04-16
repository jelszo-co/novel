import { AUTH_SUCCESS, AUTH_FAIL } from './types';
import { auth } from '../firebase';

export const authUser = (email, pass) => async dispatch => {
  try {
    auth().signInWithEmailAndPassword(email, pass);
  } catch (err) {
    console.error(err);
    return dispatch({ type: AUTH_FAIL });
  }
  const payload = { role: 'user', user: {} };
  dispatch({ type: AUTH_SUCCESS, payload });
};

export const loadUser = (firebaseUser, backendUser) => async dispatch => {
  //console.log(firebaseUser, backendUser);
};
