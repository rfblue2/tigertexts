import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';



const Listing = ({ classes, listing }) => (
  <ListItem disableGutters={true}>
    <Paper className = {classes.paper} elevation={1} square={true}>
    <Grid container>
      <Grid item xs = {6} md = {6}>
        <ListItemText className={classes.bookSource} primary={listing.title} secondary={listing.kind} />
      </Grid>
      <Grid item xs = {6} md = {6}>
        {listing.price ? <ListItemText className={classes.bookPrice} primary={listing.price_type} secondary={`$${listing.price}`} /> : '' }
      </Grid>
    </Grid>
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
    maxWidth: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
    margin: '0px'
  },
  bookPrice: {
    textAlign: 'right',
    marginTop: '5px',
    marginBottom: '5px'
  },
  bookSource: {
    textAlign: 'left',
    marginLeft: '10px',
    marginTop: '5px',
    marginBottom: '5px'
  },
};

export default withStyles(styles)(Listing);
