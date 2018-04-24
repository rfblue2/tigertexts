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
import {
  handleFbResponse,
  getUser,
} from '../services/users.service';
import { UserDeserializer } from '../serializers/userSerializer';

export const getJwt = () => {
  // check if user already logged in
  const token = localStorage.getItem('jwtToken');
  console.log(token);
  return {
    type: GET_JWT,
    token,
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


export const getUserInfo = (tok) => {

  const request = token => ({
    type: GET_USER_REQ,
    token,
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
    dispatch(request(tok));
    try {
      const res = await getUser(tok);

      if (!res) {
        dispatch(notLoggedIn());
      }

      const user = UserDeserializer.deserialize(res);

      dispatch(success(user, tok));
    } catch (err) {
      dispatch(userError(err));
    }
  };
};

