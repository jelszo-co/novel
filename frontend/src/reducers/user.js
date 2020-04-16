import { AUTH_SUCCESS, AUTH_FAIL } from '../actions/types';
const initialState = {
  role: 'stranger',
  name: null,
  fUser: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        role: payload.role,
        name: payload.name,
        fUser: payload.user,
      };
    case AUTH_FAIL:
      return { ...state, role: 'stranger', name: null, fUser: {} };
    default:
      return state;
  }
};
