import {
  OFFER_ERROR,
  GET_USER_OFFERS_REQ,
  GET_USER_OFFERS_RES,
  POST_OFFER_REQ,
  POST_OFFER_RES,
  DELETE_OFFER_REQ,
  DELETE_OFFER_RES,
} from '../constants/offers.constants';
import {
  createUserOffer,
  fetchUserOffers,
  deleteUserOffer,
} from '../services/offers.service';

export const offerError = err => ({
  type: OFFER_ERROR,
  err,
});

export const getUserOffers = (token) => {
  const request = tok => ({
    type: GET_USER_OFFERS_REQ,
    token: tok,
  });

  const response = offers => ({
    type: GET_USER_OFFERS_RES,
    offers,
  });

  return async (dispatch) => {
    dispatch(request(token));
    try {
      const offers = await fetchUserOffers(token);
      dispatch(response(offers));
    } catch (err) {
      dispatch(offerError(err));
    }
  };
};

export const postOffer = (token, offerObj) => {
  const request = (tok, o) => ({
    type: POST_OFFER_REQ,
    token: tok,
    offer: o,
  });

  const response = o => ({
    type: POST_OFFER_RES,
    offer: o,
  });

  return async (dispatch) => {
    dispatch(request(token));
    try {
      const offer = await createUserOffer(token, offerObj);
      dispatch(response(offer));
    } catch (err) {
      dispatch(offerError(err));
    }
  };
};

export const declineOffer = (token, offerId, action) => {
  const request = (tok, oid, act) => ({
    type: DELETE_OFFER_REQ,
    token: tok,
    offerId: oid,
    action: act,
  });

  const response = o => ({
    type: DELETE_OFFER_RES,
    offer: o,
  });

  return async (dispatch) => {
    dispatch(request(token, offerId, action));
    try {
      const offer = await deleteUserOffer(token, offerId, action);
      dispatch(response(offer));
    } catch (err) {
      dispatch(offerError(err));
    }
  };
};
