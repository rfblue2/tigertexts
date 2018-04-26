import {
  GET_CLASS_BOOKS_REQ,
  GET_CLASS_BOOKS_RES,
  GET_USER_FAVORITES_RES,
  GET_USER_SELLING_RES,
  GET_USER_SELLING_REQ,
  GET_USER_FAVORITES_REQ,
  BOOK_ERROR,
} from '../constants/books.constants';
import {
  getClassBooks,
  getUserSelling,
  getUserFavorites,
} from '../services/books.service';

export const bookError = err => ({
  type: BOOK_ERROR,
  err,
});

export const getBooksForClasses = (classIds) => {
  const request = ids => ({
    type: GET_CLASS_BOOKS_REQ,
    classIds: ids,
  });

  const response = books => ({
    type: GET_CLASS_BOOKS_RES,
    books,
  });

  return async (dispatch) => {
    dispatch(request(classIds));
    try {
      const books = await getClassBooks(classIds);
      dispatch(response(books));
    } catch (err) {
      dispatch(bookError(err));
    }
  };
};

export const getUserSellingBooks = (token) => {
  const request = tok => ({
    type: GET_USER_SELLING_REQ,
    token: tok,
  });

  const response = selling => ({
    type: GET_USER_SELLING_RES,
    selling,
  });

  return async (dispatch) => {
    dispatch(request(token));
    try {
      const selling = await getUserSelling(token);
      dispatch(response(selling));
    } catch (err) {
      dispatch(bookError(err));
    }
  };
};

export const getUserFavoriteBooks = (token) => {
  const request = tok => ({
    type: GET_USER_FAVORITES_REQ,
    token: tok,
  });

  const response = favorites => ({
    type: GET_USER_FAVORITES_RES,
    favorites,
  });

  return async (dispatch) => {
    dispatch(request(token));
    try {
      const favorites = await getUserFavorites(token);
      dispatch(response(favorites));
    } catch (err) {
      dispatch(bookError(err));
    }
  };
};
