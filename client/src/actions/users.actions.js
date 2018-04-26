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
import {
  handleFbResponse,
  getUser,
  fetchUserActivity,
  postSelling,
  deleteSelling,
  getAndVerifyJwt,
} from '../services/users.service';
import { deserializeUser } from '../serializers/userSerializer';
import { deserializeBook } from '../serializers/bookSerializer';

export const getJwt = () => {

  const success = token => ({
    type: GET_JWT,
    token,
  });

  return async (dispatch) => {
    const token = await getAndVerifyJwt();
    console.log(token);
    dispatch(success(token));
    dispatch(getUserInfo(token, ['favorite', 'selling']));
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
      } else {
        dispatch(userError('Login res'));
      }
    } catch (err) {
      dispatch(userError(err));
    }
  };
};

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
      const res = await getUser(tok, fields);

      if (!res) {
        dispatch(notLoggedIn());
      }

      const user = await deserializeUser(res);

      dispatch(success(user, tok));
    } catch (err) {
      dispatch(userError(err));
    }
  };
};

export const getUserActivity = (tok) => {
  const request = token => ({
    type: USER_ACTIVITY_REQ,
    token,
  });

  const success = activity => ({
    type: USER_ACTIVITY_RES,
    activity,
  });

  return async (dispatch) => {
    dispatch(request(tok));
    try {
      const activity = await fetchUserActivity(tok);
      dispatch(success(activity));
    } catch (err) {
      dispatch(userError(err));
    }
  };
};

export const userPostSellBooks = (tok, user, bookIds) => {
  const request = (token, usr, ids) => ({
    type: USER_POST_SELL_REQ,
    token,
    user: usr,
    bookIds: ids,
  });

  const success = books => ({
    type: USER_POST_SELL_RES,
    books,
  });

  return async (dispatch) => {
    dispatch(request, tok, user, bookIds);
    try {
      const books = await postSelling(tok, user, bookIds);
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
