import { GOT_NOVELS } from '../actions/types';
const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case GOT_NOVELS:
      return [...state, action.payload];
    default:
      return state;
  }
};
