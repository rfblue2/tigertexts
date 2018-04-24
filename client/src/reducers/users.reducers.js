import {
  GET_JWT,
  REMOVE_JWT,
  FACEBOOK_LOGIN_REQ,
  FACEBOOK_LOGIN_RES,
  NOT_LOGGED_IN,
  GET_USER_REQ,
  GET_USER_RES,
  USER_ERROR,
} from '../constants/users.constants';

const userReducer = (state = {
  loading: false,
  token: null,
  user: null,
}, action) => {
  const {
    type, token, user, error,
  } = action;
  switch (type) {
    case GET_JWT:
      return {
        ...state, token, loading: false, error: null,
      };
    case REMOVE_JWT:
      return {
        ...state, token: null, loading: false, error: null,
      };
    case FACEBOOK_LOGIN_REQ:
      return { ...state, loading: true, error: null };
    case FACEBOOK_LOGIN_RES:
      return {
        ...state, token, loading: false, error: null,
      };
    case GET_USER_REQ:
      return { ...state, loading: true, error: null };
    case GET_USER_RES:
      return {
        ...state, token, user, loading: false, error: null,
      };
    case NOT_LOGGED_IN:
      return {
        ...state, token: null, user: null, loading: false, error: null,
      };
    case USER_ERROR:
      return { ...state, error };
    default:
      return state;
  }
};

export default userReducer;
