import { GOT_NOVELS, SET_NOVEL, NOVEL_ERROR, SET_COMMENTS } from './types';
import axios from 'axios';
import { setPopup } from './popup';
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

export const getNovel = (novel, callback) => async dispatch => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_SRV_ADDR + '/novel/' + novel,
    );
    await dispatch({ type: SET_NOVEL, payload: res.data });
    const comments = await axios.get(
      process.env.REACT_APP_SRV_ADDR + '/comment/path/' + novel,
    );
    await dispatch({ type: SET_COMMENTS, payload: comments.data });
    callback(res.data);
  } catch (err) {
    if (err.response.status === 404) {
      return dispatch({ type: NOVEL_ERROR });
    }
    console.error(err);
    dispatch(setPopup(i18n.t('err_novel_single'), 'err'));
  }
};

export const setNovel = novel => async dispatch => {
  dispatch({ type: SET_NOVEL, payload: novel });
};

export const setComments = comments => async dispatch => {
  dispatch({ type: SET_COMMENTS, payload: comments });
};
