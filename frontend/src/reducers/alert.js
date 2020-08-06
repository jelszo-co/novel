import isEmpty from 'lodash/isEmpty';
import { SET_ALERT, DEL_ALERT } from '../actions/types';

const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ALERT:
      return isEmpty(state) ? payload : state;
    case DEL_ALERT:
      return {};
    default:
      return state;
  }
};
