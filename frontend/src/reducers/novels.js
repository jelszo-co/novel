import {
  GOT_NOVELS,
  SET_NOVEL,
  SET_COMMENTS,
  NOVEL_ERROR,
  CLEAR_NOVEL,
} from '../actions/types';

const initialState = {
  list: {},
  loading: true,
  novel: {},
  comments: {},
  novelLoading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GOT_NOVELS:
      return { ...state, list: action.payload, loading: false };
    case SET_NOVEL:
      return { ...state, novel: action.payload };
    case SET_COMMENTS:
      return { ...state, comments: action.payload, novelLoading: false };
    case NOVEL_ERROR:
      return { ...state, novel: { error: true }, novelLoading: false };
    case CLEAR_NOVEL:
      return { ...state, novel: {}, comments: {}, novelLoading: true };
    default:
      return state;
  }
};
