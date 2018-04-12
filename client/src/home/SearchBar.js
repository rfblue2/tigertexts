import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';

const SearchBar = ({ executeSearch, classes }) => (
  <TextField
    id="book_id"
    margin="none"
    className={classes.searchBar}
    onKeyPress={executeSearch}
  />
);

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  executeSearch: PropTypes.func.isRequired,
};

const styles = {
  searchBar: {
    width: '100%',
  },
};

export default withStyles(styles)(SearchBar);
