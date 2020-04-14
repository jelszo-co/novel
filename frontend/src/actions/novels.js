import { GOT_NOVELS } from './types';
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
