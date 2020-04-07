import { SET_POPUP, DEL_POPUP } from '../actions/types';

const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_POPUP:
      return [...state, payload];
    case DEL_POPUP:
      return state.filter(popup => popup.id !== payload);
    default:
      return state;
  }
};
