import { GOT_NOVELS, SET_NOVEL, NOVEL_ERROR } from './types';
import axios from 'axios';
import { setPopup } from './popup';
import { push } from 'react-router-redux';
import i18n from 'i18next';

export const getNovels = () => async dispatch => {
  try {
    const res = await axios.get(process.env.REACT_APP_SRV_ADDR + '/novel/');
    dispatch({ type: GOT_NOVELS, payload: res.data });
  } catch (err) {
    console.error(err);
    dispatch(setPopup(i18n.t('err_novel_list'), 'err'));
  }
};

export const setNovel = (novel, callback) => async dispatch => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_SRV_ADDR + '/novel/' + novel,
    );
    await dispatch({ type: SET_NOVEL, payload: res.data });
    callback(res.data);
  } catch (err) {
    if (err.response.status === 404) {
      return dispatch({ type: NOVEL_ERROR });
    }
    console.error(err);
    dispatch(setPopup(i18n.t('err_novel_single'), 'err'));
  }
};
