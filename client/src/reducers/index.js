import { combineReducers } from 'redux';
import user from './users.reducers';
import book from './books.reducers';
import listing from './listings.reducers';
import offer from './offers.reducers';

export default combineReducers({
  user,
  book,
  listing,
  offer,
});
