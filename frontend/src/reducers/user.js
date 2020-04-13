import { AUTH_SUCCESS, AUTH_FAIL } from '../actions/types';
const initialState = {
  role: 'stranger',
  user: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case AUTH_SUCCESS:
      return { ...state, role: payload.role, user: payload.user };
    case AUTH_FAIL:
      return { ...state, role: 'stranger', user: {} };
    default:
      return state;
  }
};
