import { v4 as uuidv4 } from 'uuid';
import { SET_POPUP, DEL_POPUP } from './types';

export const setPopup = (msg, type) => dispatch => {
  const id = uuidv4();
  dispatch({
    type: SET_POPUP,
    payload: {
      msg,
      type,
      id,
    },
  });
  setTimeout(() => {
    dispatch({ type: DEL_POPUP, payload: id });
  }, 5200);
};
