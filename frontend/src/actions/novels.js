import { GOT_NOVELS } from './types';
import axios from 'axios';
import { setPopup } from './popup';

export const getNovels = errMsg => async dispatch => {
  try {
    const res = await axios.get(process.env.REACT_APP_SRV_ADDR + '/novel/');
    dispatch({ type: GOT_NOVELS, payload: res.data });
  } catch (err) {
    console.error(err);
    dispatch(setPopup(errMsg, 'err'));
  }
};
