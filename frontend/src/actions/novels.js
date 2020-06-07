import axios from 'axios';
import i18n from 'i18next';
import {
  GOT_NOVELS,
  SET_NOVEL,
  NOVEL_ERROR,
  SET_COMMENTS,
  CLEAR_NOVEL,
} from './types';
import { setPopup } from './popup';

export const getNovels = () => async dispatch => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_SRV_ADDR}/novel/`);
    dispatch({ type: GOT_NOVELS, payload: res.data });
  } catch (err) {
    console.error(err);
    dispatch(setPopup(i18n.t('err_novel_list'), 'err'));
  }
};

export const getNovel = (title, callback = () => {}) => async dispatch => {
  let novel, comments;
  try {
    [novel, comments] = await Promise.all([
      axios.get(process.env.REACT_APP_SRV_ADDR + '/novel/' + title),
      axios.get(process.env.REACT_APP_SRV_ADDR + '/comment/path/' + title),
    ]);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return dispatch({ type: NOVEL_ERROR });
    }
    console.error(err);
    dispatch(setPopup(i18n.t('err_novel_single'), 'err'));
  }

  await dispatch({ type: SET_NOVEL, payload: novel.data });
  await dispatch({ type: SET_COMMENTS, payload: comments.data });
  callback(novel.data);
};

export const setNovel = novel => async dispatch => {
  dispatch({ type: SET_NOVEL, payload: novel });
};

export const setComments = comments => async dispatch => {
  dispatch({ type: SET_COMMENTS, payload: comments });
};

export const clearNovel = () => async dispatch =>
  dispatch({ type: CLEAR_NOVEL });
