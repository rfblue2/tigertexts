import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';

import Paper from 'material-ui/Paper';



const Listing = ({ classes, listing }) => (
  <ListItem>
    <Paper className = {classes.paper}>
    <ListItemText className={classes.bookSource} primary={listing.title} secondary={listing.kind} />
    {listing.price ? <ListItemText className={classes.bookPrice} secondary={`$${listing.price}`} /> : '' }
    </Paper>
  </ListItem>
);

Listing.propTypes = {
  classes: PropTypes.object.isRequired,
  listing: PropTypes.object.isRequired,
};

const styles = {
  paper: {
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
    borderRadius: '10px',
  },
  bookPrice: {
    textAlign: 'right',
  },
  bookSource: {
    textAlign: 'left',
    marginLeft: '10px',
    marginTop: '5px',
  },
};

export default withStyles(styles)(Listing);
