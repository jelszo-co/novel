import { GOT_NOVELS } from '../actions/types';

const initialState = {
  list: {},
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GOT_NOVELS:
      return { ...state, list: action.payload, loading: false };
    default:
      return state;
  }
};
