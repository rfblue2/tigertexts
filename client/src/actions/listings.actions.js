import {
  OPEN_LISTING_DIALOG,
  CLOSE_LISTING_DIALOG,
  GET_LISTING_REQ,
  GET_LISTING_RES,
  LISTING_ERR,
} from '../constants/listings.constants';
import { fetchListing } from '../services/listings.service';

export const listingError = err => ({
  type: LISTING_ERR,
  err,
});

export const openListingDialog = () => ({
  type: OPEN_LISTING_DIALOG,
});

export const closeListingDialog = () => ({
  type: CLOSE_LISTING_DIALOG,
});

export const getListing = (id) => {
  const request = listingId => ({
    type: GET_LISTING_REQ,
    id: listingId,
  });

  const response = listing => ({
    type: GET_LISTING_RES,
    listing,
  });

  return async (dispatch) => {
    dispatch(request(id));
    try {
      const listing = await fetchListing(id);
      dispatch(response(listing));
    } catch (err) {
      dispatch(listingError(err));
    }
  };
};
