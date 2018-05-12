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
  USER_POST_FAV_REQ,
  USER_POST_FAV_RES,
  USER_DELETE_FAV_REQ,
  USER_DELETE_FAV_RES,
  CLOSE_SNACK,
  SHOW_OVERFLOW_SNACK,
} from '../constants/users.constants';
import {
  handleFbResponse,
  getUser,
  postSelling,
  deleteSelling,
  getAndVerifyJwt,
  postFavorite,
  deleteFavorite,
} from '../services/users.service';
import { deserializeBook } from '../serializers/bookSerializer';

export const closeSnack = () => ({
  type: CLOSE_SNACK,
});

export const showOverflowSnack = () => ({
  type: SHOW_OVERFLOW_SNACK,
});

export const getUserInfo = (tok, fields) => {
  const request = (token, queryFields) => ({
    type: GET_USER_REQ,
    token,
    fields: queryFields,
  });

  const success = (user, token) => ({
    type: GET_USER_RES,
    token,
    user,
  });

  const notLoggedIn = () => ({
    type: NOT_LOGGED_IN,
  });

  return async (dispatch) => {
    dispatch(request(tok, fields));
    try {
      const user = await getUser(tok, fields);

      if (!user) {
        dispatch(notLoggedIn());
      }

      dispatch(success(user, tok));
    } catch (err) {
      dispatch(userError(err));
    }
  };
};

export const getJwt = () => {
  const success = token => ({
    type: GET_JWT,
    token,
  });

  return async (dispatch) => {
    const token = await getAndVerifyJwt();
    // console.log(token);
    dispatch(success(token));
    dispatch(getUserInfo(token));
  };
};

export const removeJwt = () => {
  localStorage.removeItem('jwtToken');
  return {
    type: REMOVE_JWT,
  };
};

export const userError = err => ({
  type: USER_ERROR,
  err,
});

export const facebookResponse = (res) => {
  const request = fbRes => ({
    type: FACEBOOK_LOGIN_REQ,
    res: fbRes,
  });

  const success = token => ({
    type: FACEBOOK_LOGIN_RES,
    token,
  });

  return async (dispatch) => {
    dispatch(request(res));
    try {
      const loginRes = await handleFbResponse(res);
      if (loginRes.ok) {
        // console.log(JSON.stringify(userObj, null, 2));
        const jwtToken = loginRes.headers.get('x-auth-token');
        localStorage.setItem('jwtToken', jwtToken);
        dispatch(success(jwtToken));
        dispatch(getUserInfo(jwtToken));
      } else {
        dispatch(userError('Login res'));
      }
    } catch (err) {
      dispatch(userError(err));
    }
  };
};

export const userOpenSellDialog = book => ({
  type: USER_SELL_DIALOG,
  book,
});

export const userCancelSellDialog = () => ({
  type: USER_SELL_DIALOG_CANCEL,
});

export const userPostSellBooks = (tok, user, bookIds, sellData) => {
  const request = (token, usr, ids, sellDat) => ({
    type: USER_POST_SELL_REQ,
    token,
    user: usr,
    bookIds: ids,
    sellData: sellDat,
  });

  const success = books => ({
    type: USER_POST_SELL_RES,
    books,
  });

  return async (dispatch) => {
    dispatch(request, tok, user, bookIds, sellData);
    try {
      const books = await postSelling(tok, user, bookIds, sellData);
      dispatch(success(books));
    } catch (err) {
      dispatch(userError(err));
    }
  };
};

export const userDeleteSellBook = (tok, bookId) => {
  const request = (token, id) => ({
    type: USER_DELETE_SELL_REQ,
    token,
    bookId: id,
  });

  const success = book => ({
    type: USER_DELETE_SELL_RES,
    book,
  });

  return async (dispatch) => {
    dispatch(request, tok, bookId);
    try {
      const res = await deleteSelling(tok, bookId);
      const resjson = await res.json();
      const book = await deserializeBook(resjson);
      dispatch(success(book));
    } catch (err) {
      dispatch(userError(err));
    }
  };
};

export const userPostFavorite = (tok, user, bookId) => {
  const request = (token, usr, id) => ({
    type: USER_POST_FAV_REQ,
    token,
    user: usr,
    bookIds: id,
  });

  const success = book => ({
    type: USER_POST_FAV_RES,
    book,
  });

  return async (dispatch) => {
    dispatch(request, tok, user, bookId);
    try {
      const res = await postFavorite(tok, user, bookId);
      const resjson = await res.json();
      const book = await deserializeBook(resjson);
      dispatch(success(book[0]));
    } catch (err) {
      dispatch(userError(err));
    }
  };
};

export const userDeleteFavorite = (tok, bookId) => {
  const request = (token, id) => ({
    type: USER_DELETE_FAV_REQ,
    token,
    bookId: id,
  });

  const success = book => ({
    type: USER_DELETE_FAV_RES,
    book,
  });

  return async (dispatch) => {
    dispatch(request, tok, bookId);
    try {
      const res = await deleteFavorite(tok, bookId);
      const resjson = await res.json();
      const book = await deserializeBook(resjson);
      dispatch(success(book));
    } catch (err) {
      dispatch(userError(err));
    }
  };
};
