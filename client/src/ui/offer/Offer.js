import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';

class Offer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    offer: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
    onDecline: PropTypes.func.isRequired,
  }

  state = {
  }

  renderText(offer, userId) {
    let display = '';
    if (offer.buyer && userId === offer.buyer.id) {
      display += 'You offer to purchase';
    } else if (offer.buyer) {
      display += `${offer.buyer.name} offers to purchase`;
    }
    display += offer.book ? ` "${offer.book.title}"` : '';
    if (offer.price) {
      display += ` for $${offer.price}`;
    }
    return display;
  }

  render() {
    const {
      classes, offer, token, userId, onAccept, onDecline,
    } = this.props;

    return (
      <Card className={classes.card} >
        <CardContent>
          <Typography variant="subheader">
            {this.renderText(offer, userId)}
          </Typography>
        </CardContent>
        {
          userId !== offer.buyer.id ?
          <CardActions>
            <Button onClick={() => onAccept(token, offer, userId)}>
              Accept
            </Button>
            <Button onClick={() => onDecline(token, offer, userId)}>
              Decline
            </Button>
          </CardActions> :
          <CardActions>
            <Button onClick={() => onDecline(token, offer, userId)}>
              Revoke
            </Button>
          </CardActions>
        }
      </Card>
    );
  }
}

const styles = theme => ({
  card: {
    margin: '5px',
    transition: 'all 0.5s ease',
  },
});


export default withStyles(styles)(Offer);
