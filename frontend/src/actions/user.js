import { AUTH_SUCCESS, AUTH_FAIL } from './types';
import { auth } from '../firebase';
import axios from 'axios';

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

export const loadUser = firebaseUser => async dispatch => {
  const res = await axios.get(process.env.REACT_APP_SRV_ADDR + '/user/');
  const { name, stranger, anonim, authenticated, admin } = res;
  let role;
  if (stranger) {
    role = 'stranger';
  }
  if (anonim) {
    role = 'anonymous';
  }
  if (authenticated) {
    role = 'user';
  }
  if (admin) {
    role = 'admin';
  }
  dispatch({ type: AUTH_SUCCESS, payload: { role, name, user: firebaseUser } });
};
