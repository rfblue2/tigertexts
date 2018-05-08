import {
  OFFER_ERROR,
  GET_USER_OFFERS_REQ,
  GET_USER_OFFERS_RES,
  POST_OFFER_REQ,
  POST_OFFER_RES,
  DELETE_OFFER_RES,
  DELETE_OFFER_REQ,
} from '../constants/offers.constants';

const offerReducer = (state = {
  offers: [],
  err: null,
}, action) => {
  switch (action.type) {
    case GET_USER_OFFERS_REQ:
      return { ...state, err: null };
    case GET_USER_OFFERS_RES:
      return { ...state, err: null, offers: action.offers };
    case POST_OFFER_REQ:
      return { ...state, err: null };
    case POST_OFFER_RES:
      return { ...state, err: null, offers: [...state.offers, action.offer] };
    case DELETE_OFFER_REQ:
      return { ...state, err: null };
    case DELETE_OFFER_RES:
      return {
        ...state,
        err: null,
        offers: state.offers.filter(o => o.id !== action.offer.id),
      };
    case OFFER_ERROR:
      console.log(JSON.stringify(`ERROR: ${action.err}`));
      return { ...state, err: action.err };
    default:
      return state;
  }
};

export default offerReducer;
