import {
  GET_JWT,
  REMOVE_JWT,
  FACEBOOK_LOGIN_REQ,
  FACEBOOK_LOGIN_RES,
  NOT_LOGGED_IN,
  GET_USER_REQ,
  GET_USER_RES,
  USER_ACTIVITY_REQ,
  USER_ACTIVITY_RES,
  USER_POST_SELL_REQ,
  USER_POST_SELL_RES,
  USER_ERROR,
  USER_DELETE_SELL_REQ,
  USER_DELETE_SELL_RES,
} from '../constants/users.constants';

const defaultuser = {
  selling: [],
  favorite: [],
};

const userReducer = (state = {
  loggedIn: false,
  user: defaultuser,
  token: '',
}, action) => {
  const {
    type, token, user, activity, error, books, book,
  } = action;
  switch (type) {
    case GET_JWT:
      return {
        ...state, token, error: null, loggedIn: token !== null,
      };
    case REMOVE_JWT:
      return {
        ...state, token: '', user: defaultuser, error: null, loggedIn: false,
      };
    case FACEBOOK_LOGIN_REQ:
      return { ...state, error: null };
    case FACEBOOK_LOGIN_RES:
      return {
        ...state, token, error: null, loggedIn: true,
      };
    case GET_USER_REQ:
      return { ...state, error: null };
    case GET_USER_RES:
      return {
        ...state, user, error: null,
      };
    case USER_ACTIVITY_REQ:
      return {
        ...state, error: null,
      };
    case USER_ACTIVITY_RES:
      return {
        ...state, user: { ...state.user, activity }, error: null,
      };
    case USER_POST_SELL_REQ:
      return state;
    case USER_POST_SELL_RES:
      return {
        ...state,
        user: {
          ...state.user,
          selling: [...state.user.selling, ...books],
        },
        error: null,
      };
    case USER_DELETE_SELL_REQ:
      return state;
    case USER_DELETE_SELL_RES:
      return {
        ...state,
        user: {
          ...state.user,
          selling: state.user.selling.filter(b => b.id !== book.id),
        },
        error: null,
      };
    case NOT_LOGGED_IN:
      return {
        ...state, token: '', user: defaultuser, error: null, loggedIn: false,
      };
    case USER_ERROR:
      return { ...state, error };
    default:
      return state;
  }
};

export default userReducer;
