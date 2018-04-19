import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';

const Listing = ({ classes, listing }) => (
  <ListItem>
    <ListItemText className={classes.bookSource} primary={listing.title} secondary={listing.kind} />
    {listing.price ? <ListItemText className={classes.bookPrice} secondary={`$${listing.price}`} /> : '' }
  </ListItem>
);

Listing.propTypes = {
  classes: PropTypes.object.isRequired,
  listing: PropTypes.object.isRequired,
};

const styles = {
  bookPrice: {
    textAlign: 'right',
  },
  bookSource: {
    textAlign: 'left',
  },
};

export default withStyles(styles)(Listing);
