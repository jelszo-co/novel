import { AUTH_SUCCESS } from './types';
import axios from 'axios';

export const loadUser = firebaseUser => async dispatch => {
  const res = await axios.get(process.env.REACT_APP_SRV_ADDR + '/user/');
  console.log(res.data);
  const { name, stranger, anonim, authenticated, admin } = res.data;
  let role;
  if (stranger) {
    role = 'user'; // TODO Change back to 'stranger'
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
  console.log(role);
  dispatch({ type: AUTH_SUCCESS, payload: { role, name, user: firebaseUser } });
};
