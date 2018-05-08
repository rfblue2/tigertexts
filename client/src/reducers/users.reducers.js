import {
  GET_JWT,
  REMOVE_JWT,
  FACEBOOK_LOGIN_REQ,
  FACEBOOK_LOGIN_RES,
  NOT_LOGGED_IN,
  GET_USER_REQ,
  GET_USER_RES,
  USER_POST_SELL_REQ,
  USER_POST_SELL_RES,
  USER_ERROR,
  USER_DELETE_SELL_REQ,
  USER_DELETE_SELL_RES,
  USER_SELL_DIALOG,
  USER_SELL_DIALOG_CANCEL,
  USER_DELETE_FAV_RES,
  USER_DELETE_FAV_REQ,
  USER_POST_FAV_RES,
  USER_POST_FAV_REQ,
  CLOSE_SNACK,
} from '../constants/users.constants';
import { GET_USER_FAVORITES_RES, GET_USER_SELLING_RES } from '../constants/books.constants';
import { DELETE_OFFER_RES, POST_OFFER_RES } from '../constants/offers.constants';

const defaultuser = {
  selling: [],
  favorite: [],
};

const userReducer = (state = {
  loggedIn: false,
  sellDialog: {
    isSelling: false,
    book: {},
  },
  user: defaultuser,
  token: '',
  sellBookSnack: false,
  soldSnack: false,
  notifySellerSnack: false,
  updateOfferSnack: false,
  favoritedSnack: false,
  openSnack: false,
}, action) => {
  const {
    type, token, user, error, books, book,
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
        ...state, user: user || defaultuser, error: null,
      };
    case USER_SELL_DIALOG:
      return { ...state, sellDialog: { isSelling: true, book }, error: null };
    case USER_SELL_DIALOG_CANCEL:
      return { ...state, sellDialog: { isSelling: false, book: {} }, error: null };
    case USER_POST_SELL_REQ:
      return { ...state, sellDialog: { isSelling: false, book: {} } };
    case USER_POST_SELL_RES:
      return {
        ...state,
        user: {
          ...state.user,
          selling: [...state.user.selling, ...books],
        },
        sellDialog: { isSelling: false, book: {} },
        error: null,
        sellBookSnack: true,
        openSnack: true,
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
        soldSnack: true,
        openSnack: true,
      };
    case USER_POST_FAV_REQ:
      return { ...state, error: null };
    case USER_POST_FAV_RES:
      return {
        ...state,
        user: {
          ...state.user,
          favorite: [...state.user.favorite, book],
        },
        error: null,
        favoritedSnack: true,
        openSnack: true,
      };
    case USER_DELETE_FAV_REQ:
      return state;
    case USER_DELETE_FAV_RES:
      return {
        ...state,
        user: {
          ...state.user,
          favorite: state.user.favorite.filter(b => b.id !== book.id),
        },
        error: null,
        favoritedSnack: true,
        openSnack: true,
      };
    case GET_USER_SELLING_RES:
      return {
        ...state,
        user: {
          ...state.user,
          selling: action.books,
        },
      };
    case GET_USER_FAVORITES_RES:
      return {
        ...state,
        user: {
          ...state.user,
          favorite: action.books,
        },
      };
    case POST_OFFER_RES:
      return {
        ...state, error: null, notifySellerSnack: true, openSnack: true,
      };
    case DELETE_OFFER_RES:
      return {
        ...state, error: null, updateOfferSnack: true, openSnack: true,
      };
    case NOT_LOGGED_IN:
      return {
        ...state, token: '', user: defaultuser, error: null, loggedIn: false,
      };
    case CLOSE_SNACK:
      return {
        ...state,
        error: null,
        favoritedSnack: false,
        sellBookSnack: false,
        soldSnack: false,
        notifySellerSnack: false,
        updateOfferSnack: false,
        openSnack: false,
      };
    case USER_ERROR:
      console.log(`ERROR: ${JSON.stringify(error, null, 2)}`);
      return { ...state, error };
    default:
      return state;
  }
};

export default userReducer;
