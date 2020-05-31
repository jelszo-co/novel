import { GOT_NOVELS, SET_NOVEL, NOVEL_ERROR } from '../actions/types';
const initialState = {
  list: {},
  loading: true,
  novel: {},
  novelLoading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GOT_NOVELS:
      return { ...state, list: action.payload, loading: false };
    case SET_NOVEL:
      return { ...state, novel: action.payload, novelLoading: false };
    case NOVEL_ERROR:
      return { ...state, novel: { error: true }, novelLoading: false };
    default:
      return state;
  }
};
