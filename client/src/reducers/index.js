import { combineReducers } from 'redux';
import user from './users.reducers';
import book from './books.reducers';

export default combineReducers({
  user,
  book,
});
