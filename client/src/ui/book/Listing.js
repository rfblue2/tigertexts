import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import formatNumber from 'simple-format-number';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

class Listing extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    listing: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  };

  static getPriceTypeString(type) {
    switch (type) {
      case 'good': return '(Used - Good)';
      case 'fair': return '(Used - Fair)';
      case 'poor': return '(Used - Poor)';
      default: return `(${(type).charAt(0).toUpperCase() + (type).slice(1)})`
    }
  }

  render() {
    const { classes, listing, onClick } = this.props;
    // If not platform listing, link to URL, o/w use programmatic click handler
    const clickProps = listing.kind === 'platform' ? {
      onClick: () => onClick(listing.id),
    } : {
      component: 'a',
      href: listing.url,
      target: '_blank',
    };
    return (
      <Paper className={classes.paper} elevation={1} square>
        <Divider />
        <ListItem
          button
          disableGutters
          {...clickProps}
        >
          <Grid container>
            <Grid item xs={6} md={6}>
              <ListItemText
                className={classes.bookSource}
                primary={listing.title}
                secondary={(listing.kind).charAt(0).toUpperCase() + (listing.kind).slice(1)}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              {listing.price ?
                <ListItemText
                  className={classes.bookPrice}
                  primary={Listing.getPriceTypeString(listing.price_type)}
                  secondary={`$${formatNumber(listing.price)}`}
                /> : '' }
            </Grid>
          </Grid>
        </ListItem>
      </Paper>
    );
  }
}

const styles = {
  listitem: {
    padding: '0px',
    boxShadow: "none",
  },
  paper: {
    width: '100%',
    maxWidth: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
    margin: '0px',
  },
  bookPrice: {
    textAlign: 'right',
    marginTop: '5px',
    marginBottom: '5px',
  },
  bookSource: {
    textAlign: 'left',
    marginLeft: '10px',
    marginTop: '5px',
    marginBottom: '5px',
  },
};

export default withStyles(styles)(Listing);
