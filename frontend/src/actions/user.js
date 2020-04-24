import { AUTH_SUCCESS } from './types';
import axios from 'axios';
import { setPopup } from './popup';
import i18n from 'i18next';

export const loadUser = firebaseUser => async dispatch => {
  try {
    const res = await axios.get(process.env.REACT_APP_SRV_ADDR + '/user/');
    const { name, stranger, anonim, authenticated, admin } = res.data;
    let role;
    if (stranger) {
      role = 'admin'; // TODO Change back to 'stranger'
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
    dispatch({
      type: AUTH_SUCCESS,
      payload: { role, name, user: firebaseUser },
    });
  } catch (err) {
    console.error(err);
    dispatch(setPopup(i18n.t('err_user_get'), 'err'));
  }
};
