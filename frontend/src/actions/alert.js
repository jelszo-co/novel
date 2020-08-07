import { SET_ALERT, DEL_ALERT } from './types';

export const setAlert = (titleString, txtString) => dispatch =>
  dispatch({ type: SET_ALERT, payload: { titleString, txtString } });

export const delAlert = () => dispatch => dispatch({ type: DEL_ALERT });