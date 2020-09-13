import { SET_ALERT, DEL_ALERT } from './types';

export const setAlert = (
  titleString,
  txtString,
  isPassword = false,
  callback = () => {},
) => dispatch =>
  dispatch({ type: SET_ALERT, payload: { titleString, txtString, isPassword, callback } });

export const delAlert = () => dispatch => dispatch({ type: DEL_ALERT });
