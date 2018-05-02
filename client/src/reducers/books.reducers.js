import {
  BOOK_ERROR,
  GET_CLASS_BOOKS_RES,
  GET_CLASS_BOOKS_REQ,
  GET_USER_FAVORITES_REQ,
  GET_USER_FAVORITES_RES,
  GET_USER_SELLING_REQ,
  GET_USER_SELLING_RES, GET_SEARCH_RESULTS,
} from '../constants/books.constants';
import {
  USER_DELETE_SELL_RES,
  USER_POST_SELL_RES,
} from '../constants/users.constants';

const bookReducer = (state = {
  books: [], // books to be displayed in a book list
  display: 'search', // display search, favorites, selling, etc
}, action) => {
  switch (action.type) {
    case GET_CLASS_BOOKS_REQ:
      return { ...state, error: null };
    case GET_CLASS_BOOKS_RES:
      return {
        ...state, books: action.books, display: 'search', error: null,
      };
    case GET_SEARCH_RESULTS:
      return { ...state, display: 'search', error: null };
    case GET_USER_SELLING_REQ:
      return { ...state, error: null };
    case GET_USER_SELLING_RES:
      return { ...state, display: 'selling', error: null };
    case GET_USER_FAVORITES_REQ:
      return { ...state, error: null };
    case GET_USER_FAVORITES_RES:
      return { ...state, display: 'favorites', error: null };
    case USER_DELETE_SELL_RES:
      return { ...state, error: null };
    case USER_POST_SELL_RES:
      return { ...state, error: null };
    case BOOK_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export default bookReducer;
