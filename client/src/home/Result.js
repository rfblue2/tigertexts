import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText } from 'material-ui/List';

const Result = ({ book, onClick }) => (
  // What if we used card instead http://www.material-ui.com/#/components/card
  <ListItem button onClick={() => onClick(book.id)}>
    <ListItemText primary={book.title} />
  </ListItem>
);

Result.propTypes = {
  book: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Result;
