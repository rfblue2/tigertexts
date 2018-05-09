import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';
import { FormControl } from 'material-ui/Form';
import Input, { InputAdornment, InputLabel } from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

class ListingDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    listing: PropTypes.object,
    user: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    onOffer: PropTypes.func.isRequired,
    showForm: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    listing: {},
  }

  state = {
    price: 0,
  }

  static getPriceTypeString(type) {
    if (!type) return '';
    switch (type) {
      case 'good': return '(Used - Good)';
      case 'fair': return '(Used - Fair)';
      case 'poor': return '(Used - Poor)';
      default: return `(${(type).charAt(0).toUpperCase() + (type).slice(1)})`
    }
  }

  onPriceChange = (e) => {
    if (e.target.value === '') this.setState({ price: '' });
    else this.setState({ price: Math.min(999, Math.max(0, e.target.value)) });
  }

  render() {
    const {
      classes, token, loggedIn, listing, user, showForm, onClose, onOffer,
    } = this.props;
    const { price } = this.state;
    const userIsSeller = !(user.id && listing.seller && user.id !== listing.seller.id);

    return (
      <Dialog
        aria-labelledby="buy-a-book"
        open={showForm}
        onClose={onClose}
        className={classes.dialog}
      >
        {
          loggedIn ?
            (
              <div>
                <DialogTitle id="buy-a-book">
                  {listing.book ? listing.book.title : ''}
                </DialogTitle>
                <DialogContent className={classes.content}>
                  <Typography variant="subheading">
                    Sold by {listing.seller ? listing.seller.name : ''}
                    {listing.price ? ` for $${listing.price}` : ''}
                  </Typography>
                  <Typography variant="subheading">
                    {listing.price_type ?
                      ListingDialog.getPriceTypeString(listing.price_type) : ''}
                  </Typography>
                  <br />
                  <Typography variant="body1">
                    {listing.detail}
                  </Typography>
                  {
                    userIsSeller ? '' :
                    <FormControl>
                      <InputLabel htmlFor={`offer-${listing.id}`}>Offer Price (optional)</InputLabel>
                      <Input
                        id={`price-${listing.id}`}
                        value={price}
                        type="number"
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        onChange={this.onPriceChange.bind(this)}
                      />
                    </FormControl>
                  }
                </DialogContent>
                <DialogActions>
                  <Button onClick={onClose}>Close</Button>
                  {
                    userIsSeller ? '' :
                      <Button onClick={() => onOffer(token, listing.id, price, user.id)}>
                      Make Offer
                      </Button>
                  }
                </DialogActions>
              </div>
            ) :
          (<DialogTitle id="buy-a-book">Login to purchase books from other users!</DialogTitle>)
        }
      </Dialog>
    );
  }
}

const styles = {
  dialog: {
  },
  content: {
    height: '200px',
  },
};

export default withStyles(styles)(ListingDialog);
