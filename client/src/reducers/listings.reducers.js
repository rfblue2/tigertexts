import {
  OPEN_LISTING_DIALOG,
  CLOSE_LISTING_DIALOG,
  GET_LISTING_REQ,
  GET_LISTING_RES,
  LISTING_ERR,
} from '../constants/listings.constants';
import { POST_OFFER_RES } from '../constants/offers.constants';

const listingReducer = (state = {
  dialogOpen: false,
  listing: {},
}, action) => {
  switch (action.type) {
    case OPEN_LISTING_DIALOG:
      return { ...state, err: null, dialogOpen: true };
    case CLOSE_LISTING_DIALOG:
      return {
        ...state, err: null, dialogOpen: false, listing: {},
      };
    case GET_LISTING_REQ:
      return { ...state, err: null };
    case GET_LISTING_RES:
      return { ...state, err: null, listing: action.listing };
    case POST_OFFER_RES:
      return { ...state, err: null, dialogOpen: false };
    case LISTING_ERR:
      return { ...state, err: action.err };
    default:
      return state;
  }
};

export default listingReducer;
